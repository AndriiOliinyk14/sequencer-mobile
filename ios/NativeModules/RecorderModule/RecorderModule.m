//
//  RecorderModule.m
//  Sequencer
//
//  Created by Andrii on 27.11.2024.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RecorderModule, NSObject)

RCT_EXTERN_METHOD(record:(NSString *)name resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)
RCT_EXTERN_METHOD(stop:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)
RCT_EXTERN_METHOD(cleanup)

@end
