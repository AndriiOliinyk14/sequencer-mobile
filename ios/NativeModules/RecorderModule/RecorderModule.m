//
//  RecorderModule.m
//  Sequencer
//
//  Created by Andrii on 27.11.2024.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RecorderModule, NSObject)

RCT_EXTERN_METHOD(record:(NSString *)name)
RCT_EXTERN_METHOD(stop:(RCTResponseSenderBlock *) callback)
RCT_EXTERN_METHOD(play)

@end
