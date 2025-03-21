//
//  PlayerModule.m
//  Sequencer
//
//  Created by Andrii Oliinyk on 17.03.2025.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PlayerModule, NSObject)

RCT_EXTERN_METHOD(load:(NSString *)url
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter
                  )
RCT_EXTERN_METHOD(play)
RCT_EXTERN_METHOD(stop)
RCT_EXTERN_METHOD(cleanup)

@end
