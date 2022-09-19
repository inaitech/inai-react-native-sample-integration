//
//  RCTInaiCheckoutModule.swift
//  inai_reactnative_63
//
//  Created by Parag Dulam on 4/27/22.
//  Updated by Amit Yadav on 19/08/2022
//  - Fixed error handling and delegate callback logic to pass the result
//


import Foundation
import inai_ios_sdk
import UIKit
import React
import PassKit

@objc(InaiCheckoutModule)
class InaiCheckoutModule: NSObject {
  
  private var resolver: RCTPromiseResolveBlock!
  private var vc: UIViewController?
  
  private var applePayCompletion: ((PKPaymentAuthorizationResult) -> Void)?
  private var config: [String: String]?
  
  @objc(requiresMainQueueSetup)
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  private func getInaiConfigFromDict(_ config: [String: Any]) -> InaiConfig? {
    do {
      let json = try JSONSerialization.data(withJSONObject: config)
      let decoder = JSONDecoder()
      decoder.keyDecodingStrategy = .useDefaultKeys
      let inaiConfig = try decoder.decode(InaiConfig.self, from: json)
      return inaiConfig
    } catch {
      print(error)
    }
    
    return nil
  }
  
  
  @objc(presentCheckout:withResolver:withRejecter:)
  func presentCheckout(config: [String: Any], resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) -> Void {
    self.resolver = resolve;
    DispatchQueue.main.async {
      if let inaiConfig = self.getInaiConfigFromDict(config),
         let inaiCheckout = InaiCheckout(config: inaiConfig),
         let viewController = RCTPresentedViewController()  {
        self.vc = viewController
        inaiCheckout.presentCheckout(viewController: viewController, delegate: self)
      } else {
        let error = NSError(domain: "error", code: 0, userInfo: ["message": "Invalid Config"])
        reject("error", "Invalid Config", error);
      }
    }
  }
  
  @objc(makePayment:railCode:paymentDetails:withResolver:withRejecter:)
  func makePayment(config: [String: Any], railCode: String, paymentDetails: [String: Any],
                   resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) -> Void {
    self.resolver = resolve;
    DispatchQueue.main.async {
      if let inaiConfig = self.getInaiConfigFromDict(config),
         let inaiCheckout = InaiCheckout(config: inaiConfig),
         let viewController = RCTPresentedViewController()  {
        self.vc = viewController
        inaiCheckout.makePayment(paymentMethodOption: railCode,
                                 paymentDetails: paymentDetails,
                                 viewController: viewController,
                                 delegate: self)
      } else {
        let error = NSError(domain: "error", code: 0, userInfo: ["message": "Invalid Config"])
        reject("error", "Invalid Config", error);
      }
    }
  }
  
  @objc(validateFields:paymentMethodOption:paymentDetails:withResolver:withRejecter:)
  func validateFields(config: [String: Any],
                      paymentMethodOption: String, paymentDetails: [String : Any],
                      resolve:@escaping RCTPromiseResolveBlock,
                      reject:@escaping RCTPromiseRejectBlock) -> Void {
    self.resolver = resolve;
    DispatchQueue.main.async {
      if let inaiConfig = self.getInaiConfigFromDict(config),
         let inaiCheckout = InaiCheckout(config: inaiConfig),
         let viewController = RCTPresentedViewController()  {
        self.vc = viewController
        inaiCheckout.validateFields(paymentMethodOption: paymentMethodOption,
                                    paymentDetails: paymentDetails,
                                    viewController: viewController,
                                    delegate: self)
      } else {
        let error = NSError(domain: "error", code: 0, userInfo: ["message": "Invalid Config"])
        reject("error", "Invalid Config", error);
      }
    }
  }
  
  @objc(getCardInfo:cardNumber:withResolver:withRejecter:)
  func getCardInfo(config: [String: Any], cardNumber: String,
                   resolve:@escaping RCTPromiseResolveBlock,
                   reject:@escaping RCTPromiseRejectBlock) -> Void {
    self.resolver = resolve;
    DispatchQueue.main.async {
      if let inaiConfig = self.getInaiConfigFromDict(config),
         let inaiCheckout = InaiCheckout(config: inaiConfig),
         let viewController = RCTPresentedViewController() {
        self.vc = viewController
        inaiCheckout.getCardInfo(cardNumber: cardNumber,
                                 viewController: viewController,
                                 delegate: self)
      } else {
        let error = NSError(domain: "error", code: 0, userInfo: ["message": "Invalid Config"])
        reject("error", "Invalid Config", error);
      }
    }
  }
  
  @objc(getApplePayRequestData:withResolver:withRejecter:)
  func getApplePayRequestData(paymentMethodOptionsData: [String : Any],
                              resolve:@escaping RCTPromiseResolveBlock,
                              reject:@escaping RCTPromiseRejectBlock) -> Void {
    var applePayRequestDict: [String: Any] = [:]

    if let applePayRequestData = InaiCheckout.getApplePayRequestData(paymentMethodOptionsData: paymentMethodOptionsData) {
      applePayRequestDict = [
        "currencyCode" : applePayRequestData.currencyCode,
        "countryCode" : applePayRequestData.countryCode,
        "merchantId" : applePayRequestData.merchantId,
        "productDescription" : applePayRequestData.productDescription,
        "orderAmount" : applePayRequestData.orderAmount,
        "canMakePayments" : applePayRequestData.canMakePayments,
        "canSetupCards" : applePayRequestData.canSetupCards,
        "supportedNetworks" : applePayRequestData.supportedNetworks
      ]
    } else {
      applePayRequestDict["message"] = "no data"
    }
    
    return resolve(applePayRequestDict)
  }
  
  @objc func setupApplePay() {
    DispatchQueue.main.async {
      let passLibrary = PKPassLibrary()
      passLibrary.openPaymentSetup()
    }
  }
  
  @objc(payWithApplePay:withApplePaymentRequestData:withResolver:withRejecter:)
  func payWithApplePay(config: [String:String],
                       withApplePaymentRequestData paymentRequestData: [String: Any],
                       resolve:@escaping RCTPromiseResolveBlock,
                       reject:@escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      if let viewController = RCTPresentedViewController()  {
        self.config = config
        self.vc = viewController
        self.resolver = resolve
        let orderSummary = PKPaymentSummaryItem(label: paymentRequestData["productDescription"] as! String,
                                                amount: NSDecimalNumber(string: paymentRequestData["orderAmount"] as? String ?? "0"),
                                                type: .final)
        let paymentSummaryItems = [orderSummary]
        
        // Create a payment request.
        let paymentRequest = PKPaymentRequest()
        paymentRequest.paymentSummaryItems = paymentSummaryItems
        paymentRequest.merchantIdentifier = paymentRequestData["merchantId"] as! String
        paymentRequest.merchantCapabilities = .capability3DS
        
        paymentRequest.countryCode = paymentRequestData["countryCode"] as! String
        paymentRequest.currencyCode = paymentRequestData["currencyCode"] as! String
        
        paymentRequest.supportedNetworks = [.amex, .visa, .masterCard, .discover]
        
        let paymentController = PKPaymentAuthorizationController(paymentRequest: paymentRequest)
        paymentController.delegate = self
        paymentController.present(completion: { (presented: Bool) in
          if presented {
            debugPrint("Presented payment controller")
          } else {
            let error = NSError(domain: "error", code: 0, userInfo: ["message": "Apple Pay Not Available"])
            reject("error", "Apple Pay Not Available", error);
          }
        })
      }
    }
  }
}

extension InaiCheckoutModule: PKPaymentAuthorizationControllerDelegate {
  func paymentAuthorizationController(_ controller: PKPaymentAuthorizationController,
                                      didAuthorizePayment payment: PKPayment,
                                      handler completion: @escaping (PKPaymentAuthorizationResult) -> Void) {
      let config = InaiConfig(token: config!["token"],
                              orderId : config!["orderId"],
                              countryCode: config!["countryCode"] )
      
      if let inaiCheckout = InaiCheckout(config: config) {
          
          let paymentDetails = InaiCheckout.convertPaymentTokenToDict(payment: payment)
          self.applePayCompletion = completion
          
          inaiCheckout.makePayment( paymentMethodOption: "apple_pay",
                                    paymentDetails: paymentDetails,
                                    viewController: self.vc!,
                                    delegate: self)
      }
  }

  func paymentAuthorizationControllerDidFinish(_ controller: PKPaymentAuthorizationController) {
    controller.dismiss {}
  }
}

extension InaiCheckoutModule: InaiCheckoutDelegate {
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

extension InaiCheckoutModule: InaiValidateFieldsDelegate {
  func fieldsValidationFinished(with result: Inai_ValidateFieldsResult) {
    if let vc = self.vc {
      vc.dismiss(animated: true) {
        var status = "failed"
        if( result.status == Inai_ValidateFieldsStatus.success) {
          status = "success"
        }
        
        let resultDict: [String: Any] = ["status": status, "data": result.data]
        //  pass the data back to the react native resolver
        self.resolver(resultDict)
      }
    }
  }
}

extension InaiCheckoutModule: InaiCardInfoDelegate {
  func cardInfoFetched(with result: Inai_CardInfoResult) {
    if let vc = self.vc {
      vc.dismiss(animated: true) {
        var status = "failed"
        if( result.status == Inai_CardInfoStatus.success) {
          status = "success"
        }
        
        let resultDict: [String: Any] = ["status": status, "data": result.data]
        //  pass the data back to the react native resolver
        self.resolver(resultDict)
      }
    }
  }
}
