
//
//  Sampler.swift
//  Sequencer
//
//  Created by Andrii on 26.10.2024.
//

import Foundation
import AVFAudio
import React

@objc(SamplerModule)
class SamplerModule: NSObject {
  var samples: [SampleModule] = []
  var recorder: RecorderModule
  var engine: AVAudioEngine
  
  override init (){
    engine = AVAudioEngine()
    recorder = RecorderModule()
    let audioSession = AVAudioSession.sharedInstance()
    
    do {
      try audioSession.setCategory(.playback, mode: .default)
      try audioSession.setActive(true)
      
      
    } catch {
      return
    }
  }
  
  @objc
  func getSamplesNames() -> [String] {
    self.samples.map({$0.name})
  }
  
  
  @objc func addSample(_ name: String, url: String, settings: [String: Float], callback: RCTResponseSenderBlock) {
    guard let fileURL = URL(string: url) else {
      return
    }
    
    let volume = settings["volume"] ?? 1.0
    let pan = settings["pan"] ?? 0.0
    let reverb = settings["reverb"] ?? 0.0
    
    let settings = SampleSettings(volume: volume, pan: pan, reverb: reverb)
    let sample = SampleModule(self.engine, name, fileURL, settings: settings)
    
    samples.append(sample)
    
    if !engine.isRunning {
      engine.prepare()
      try! engine.start()
    }
    
    callback([["key": name, "volume": volume, "pan": pan, "reverb": reverb]])
  }
  
  
  @objc func playSample(_ name: String) {
    if let sample = samples.first(where: { $0.name == name }) {
      sample.play()
    } else {
      print("Sample not found: \(name)")
    }
  }
  
  @objc func setSampleVolume (_ name: String, volume: Float) {
    print("volume", volume)
    if let sample = samples.first(where: { $0.name == name }) {
      sample.setVolume(volume)
    } else {
      print("Sample not found: \(name)")
    }
  }
  
  //  @objc func setSamplePan (_ name: String, pan: Float) {
  //    if let sample = samples.first(where: { $0.name == name }) {
  //      sample.setPan(pan)
  //    } else {
  //      print("Sample not found: \(name)")
  //    }
  //  }
  //
  //  @objc func setSampleReverb (_ name: String, reverb: Float) {
  //    if let sample = samples.first(where: { $0.name == name }) {
  //      sample.setReverb(reverb)
  //    } else {
  //      print("Sample not found: \(name)")
  //    }
  //  }
  //
}
