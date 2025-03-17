//
//  AudioTrimmerModule.m
//  Sequencer
//
//  Created by Andrii Oliinyk on 14.03.2025.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AudioTrimmerModule, NSObject)

RCT_EXTERN_METHOD(trim:(NSString *)filePath
                  startTime:(double)startTime
                  endTime:(double)endTime
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)
RCT_EXTERN_METHOD(play)
RCT_EXTERN_METHOD(cleanup)

@end
