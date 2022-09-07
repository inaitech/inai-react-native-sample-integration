//
//  RCTBridge.m
//  inai_reactnative_63
//
//  Created by Parag Dulam on 4/28/22.
//  Update by Amit Yadav on 08/21/22 - Added Validate fields method
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(InaiCheckoutModule, NSObject)

RCT_EXTERN_METHOD(presentCheckout:(NSDictionary *)config
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(makePayment:(NSDictionary *)config railCode:(NSString *)railCode
                  paymentDetails:(NSDictionary *)paymentDetails
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(validateFields:(NSDictionary *)config paymentMethodOption:(NSString *)paymentMethodOption
                  paymentDetails:(NSDictionary *)paymentDetails
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getCardInfo:(NSDictionary *)config cardNumber:(NSString *)cardNumber
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
@end
