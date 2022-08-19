//
//  RCTInaiCheckoutModule.swift
//  inai_reactnative_63
//
//  Created by Parag Dulam on 4/27/22.
//


import Foundation
import inai_ios_sdk
import UIKit
import React

@objc(InaiCheckoutModule)
class InaiCheckoutSdk: NSObject {
    
    var resolver: RCTPromiseResolveBlock!
    var vc: UIViewController?
    
    @objc(requiresMainQueueSetup)
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(makePayment:orderId:countryCode:railCode:paymentDetails:withResolver:withRejecter:)
    func makePayment(token: String, orderId: String, countryCode: String, railCode: String, paymentDetails: [String: Any], resolve:@escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        self.resolver = resolve;
        let styles = InaiConfig_Styles(
            container: InaiConfig_Styles_Container(backgroundColor: "#fff"),
            cta: InaiConfig_Styles_Cta(backgroundColor: "#123456"),
            errorText: InaiConfig_Styles_ErrorText(color: "#000000")
        )

        let config = InaiConfig(token: token,
                                orderId : orderId,
                                styles: styles,
                                countryCode: countryCode
        )

        DispatchQueue.main.async {
            if let inaiCheckout = InaiCheckout(config: config),
                let viewController = RCTPresentedViewController()  {
                self.vc = viewController
                inaiCheckout.makePayment(paymentMethodOption: railCode,
                                         paymentDetails: paymentDetails,
                                         viewController: viewController,
                                         delegate: self)
            }
        }
    }
}

extension InaiCheckoutSdk: InaiCheckoutDelegate {
    
    func convertDictToStr(_ dict: [String:Any]) -> String {
        var jsonStr = "";
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: dict, options: .fragmentsAllowed)
            jsonStr = String(data: jsonData, encoding: String.Encoding.utf8) ?? ""
        } catch {}
        
        return jsonStr
    }
  
    func paymentFinished(with result: Inai_PaymentResult) {
        if let vc = self.vc {
            vc.dismiss(animated: true) {

              var status = "canceled"
              if( result.status == Inai_PaymentStatus.success) {
                status = "success"
              } else if (result.status == Inai_PaymentStatus.failed) {
                status = "failed"
              }
              
              let resultDict: [String: Any] = ["status": status, "data": result.data]
              //  pass the data back to the react native resolver
              self.resolver(resultDict)
            }
        }
    }
}

/*
import Foundation
import inai_ios_sdk
import React


@objc(InaiCheckoutModule)
class InaiCheckoutModule: NSObject {
  
  private var paymentCompletion: RCTResponseSenderBlock?
  
  @objc func getName(_ successCallback:RCTResponseSenderBlock) { // Assume name comes from the any native API side
    successCallback(["SWIFT native Module"])
  }
  
  @objc func callInaiCheckout(_ inaiToken: String,
                                 orderId: String,
                                 country: String,
                              completion: @escaping RCTResponseSenderBlock) {
    let styles = InaiConfig_Styles(
        container: InaiConfig_Styles_Container(backgroundColor: "#fff"),
        cta: InaiConfig_Styles_Cta(backgroundColor: "#123456"),
        errorText: InaiConfig_Styles_ErrorText(color: "#000000")
    )
    
    let config = InaiConfig(token: inaiToken,
                            orderId : orderId,
                            styles: styles,
                            countryCode: country)    
    DispatchQueue.main.async {
      if let inaiCheckout = InaiCheckout(config: config),
          let viewController = RCTPresentedViewController() {
          self.paymentCompletion = completion
        
          inaiCheckout.presentCheckout(viewController: viewController, delegate: self)
      }
    }
  }
  
  @objc func makePayment(token: String,
                         paymentMethodOption: String,
                         paymentDetails: [String: AnyObject],
                         orderId: String,
                         countryCode: String,
                         completion: RCTResponseSenderBlock) {
      let config = InaiConfig(token: token,
                              orderId : orderId,
                              countryCode: countryCode
      )
      
      if let inaiCheckout = InaiCheckout(config: config),
          let viewController = RCTPresentedViewController() {
          inaiCheckout.makePayment(paymentMethodOption: paymentMethodOption,
                                  paymentDetails: paymentDetails,
                                 viewController: viewController, delegate: self)
      }
  }

  
}

extension InaiCheckoutModule: InaiCheckoutDelegate {
  func convertDictToStr(_ dict: [String:Any]) -> String {
      var jsonStr = "";
      do {
          let jsonData = try JSONSerialization.data(withJSONObject: dict, options: .fragmentsAllowed)
          jsonStr = String(data: jsonData, encoding: String.Encoding.utf8) ?? ""
      } catch {}
      
      return jsonStr
  }
  
  func paymentFinished(with result: Inai_PaymentResult) {
    DispatchQueue.main.async {
      if let paymentCompletion = self.paymentCompletion {
        var jsonStr = "";
        do {
          let jsonData = try JSONSerialization.data(withJSONObject: result.data, options: .fragmentsAllowed)
          jsonStr = String(data: jsonData, encoding: String.Encoding.utf8) ?? ""
          
          var status = "canceled"
          if( result.status == Inai_PaymentStatus.success) {
            status = "success"
          } else if (result.status == Inai_PaymentStatus.failed) {
            status = "failed"
          }
          
          paymentCompletion([status, jsonStr])
        } catch {
          paymentCompletion([""])
        }
      }
    }
  }
}
*/
