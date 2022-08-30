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
