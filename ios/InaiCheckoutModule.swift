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

@objc(InaiCheckoutModule)
class InaiCheckoutModule: NSObject {
    
    var resolver: RCTPromiseResolveBlock!
    var vc: UIViewController?
    
    @objc(requiresMainQueueSetup)
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(presentCheckout:orderId:countryCode:withResolver:withRejecter:)
    func presentCheckout(token: String, orderId: String, countryCode: String, 
                    resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) -> Void {
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
                inaiCheckout.presentCheckout(viewController: viewController, delegate: self)
            } else {
                let error = NSError(domain: "error", code: 0, userInfo: ["message": "Invalid Config"])
                reject("error", "Invalid Config", error);
            }
        }
    }

    @objc(makePayment:orderId:countryCode:railCode:paymentDetails:withResolver:withRejecter:)
    func makePayment(token: String, orderId: String, countryCode: String, 
                     railCode: String, paymentDetails: [String: Any], 
                    resolve:@escaping RCTPromiseResolveBlock,reject:@escaping RCTPromiseRejectBlock) -> Void {
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
            } else {
                let error = NSError(domain: "error", code: 0, userInfo: ["message": "Invalid Config"])
                reject("error", "Invalid Config", error);
            }
        }
    }

    @objc(validateFields:orderId:countryCode:paymentMethodOption:paymentDetails:withResolver:withRejecter:)
    func validateFields(token: String, orderId: String, countryCode: String,
                        paymentMethodOption: String, paymentDetails: [String : Any],
                        resolve:@escaping RCTPromiseResolveBlock,
                        reject:@escaping RCTPromiseRejectBlock) -> Void {
        self.resolver = resolve;
        let config = InaiConfig(token: token,
                                orderId : orderId,
                                countryCode: countryCode
        )

        DispatchQueue.main.async {
            if let inaiCheckout = InaiCheckout(config: config),
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

    @objc(getCardInfo:orderId:countryCode:cardNumber:withResolver:withRejecter:)
    func getCardInfo(token: String, orderId: String, 
                    countryCode: String, cardNumber: String,
                    resolve:@escaping RCTPromiseResolveBlock,
                    reject:@escaping RCTPromiseRejectBlock) -> Void {
        self.resolver = resolve;
        let config = InaiConfig(token: token,
                                orderId : orderId,
                                countryCode: countryCode
        )

        DispatchQueue.main.async {
            if let inaiCheckout = InaiCheckout(config: config),
                let viewController = RCTPresentedViewController()  {
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
