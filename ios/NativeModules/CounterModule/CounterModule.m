//
//  IntervalModule.m
//  Sequencer/Users/andrii/MobileApps/Sequencer/ios/NativeModules/Sampler/Sampler.m
//
//  Created by Andrii on 20.11.2024.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CounterModule, NSObject)

RCT_EXTERN_METHOD(setBpm:(nonnull NSNumber *)bpm)
RCT_EXTERN_METHOD(setPatternLength:(NSInteger)patternLength)
RCT_EXTERN_METHOD(start)
RCT_EXTERN_METHOD(stop)

@end
