//
//  Sampler.m
//  Sequencer
//
//  Created by Andrii on 26.10.2024.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(SamplerModule, NSObject)

RCT_EXTERN_METHOD(addSample:(NSString *)id url:(NSString *)url settings:(NSDictionary)settings callback: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(destroySample:(NSString *)id)
RCT_EXTERN_METHOD(playSample:(NSString *)id)
RCT_EXTERN_METHOD(setSampleVolume:(NSString *)id value:(float *)value)
RCT_EXTERN_METHOD(setSampleReverb:(NSString *)id value:(float *)value)

@end
