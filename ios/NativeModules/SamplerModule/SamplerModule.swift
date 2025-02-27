
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
    engine = AudioEngineModule.shared._engine
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
    self.samples.map({$0.id})
  }
  
  
  @objc func addSample(_ id: String, url: String, settings: [String: Float], callback: RCTResponseSenderBlock) {
    guard let fileURL = URL(string: url) else {
      print("Invalid URL string")
      return
    }
    
    let volume = settings["volume"] ?? 1.0
    let pan = settings["pan"] ?? 0.0
    let reverb = settings["reverb"] ?? 0.0
    
    let settings = SampleSettings(volume: volume, pan: pan, reverb: reverb)
    let sample = SampleModule(self.engine, id, fileURL, settings: settings)
    
    samples.append(sample)
    
    if !engine.isRunning {
      engine.prepare()
      try! engine.start()
    }
    
    callback([["id": id, "volume": volume, "pan": pan, "reverb": reverb]])
  }
  
  
  @objc func playSample(_ id: String) {
    if let sample = samples.first(where: { $0.id == id }) {
      sample.play()
    } else {
      print("Sample not found: \(id)")
    }
  }
  
  @objc func setSampleVolume (_ id: String, value: Float) {
    if let sample = samples.first(where: { $0.id == id }) {
      sample.setVolume(value)
    } else {
      print("Sample not found: \(id)")
    }
  }
  
  @objc func setSampleReverb (_ id: String, value: Float) {
    if let sample = samples.first(where: { $0.id == id }) {
      sample.setReverb(value)
    } else {
      print("Sample not found: \(id)")
    }
  }
  //
}
