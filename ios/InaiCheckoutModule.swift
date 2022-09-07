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
