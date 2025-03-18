//
//  PlayerModule.m
//  Sequencer
//
//  Created by Andrii Oliinyk on 17.03.2025.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PlayerModule, NSObject)

RCT_EXTERN_METHOD(play:(NSString *)url)
RCT_EXTERN_METHOD(stop)
//RCT_EXTERN_METHOD(getCurrentPosition:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(cleanup)

@end
