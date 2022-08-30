//
//  RCTBridge.m
//  inai_reactnative_63
//
//  Created by Parag Dulam on 4/28/22.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(InaiCheckoutModule, NSObject)

RCT_EXTERN_METHOD(makePayment:(NSString *)token orderId:(NSString *)orderId
                  countryCode:(NSString *)countryCode railCode:(NSString *)railCode
                  paymentDetails:(NSDictionary *)paymentDetails
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)
@end
