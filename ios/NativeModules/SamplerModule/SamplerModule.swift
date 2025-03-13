
//
//  Sampler.swift
//  Sequencer
//
//  Created by Andrii on 26.10.2024.
//

import Foundation
import AVFAudio
import React

enum SamplerEvents: String, CaseIterable {
  case VolumeUpdate = "VolumeUpdate"
  case PanUpdate = "PanUpdate"
  case ReverbUpdate = "ReverbUpdate"
}

@objc(SamplerModule)
class SamplerModule: RCTEventEmitter {
  var samples: [SampleModule] = []
  var recorder: RecorderModule
  var engine: AVAudioEngine
  
  override init (){
    
    engine = AudioEngineModule.shared._engine
    recorder = RecorderModule()
    let audioSession = AVAudioSession.sharedInstance()
    
    
    super.init()
    
    
    do {
      try audioSession.setCategory(.playback, mode: .default)
      try audioSession.setActive(true)
      
      
    } catch {
      return
    }
    
    
  }
  
  override func supportedEvents() -> [String]! {
    return SamplerEvents.allCases.map { $0.rawValue }
  }
  
  @objc
  func getSamplesNames() -> [String] {
    self.samples.map({$0.id})
  }
  
  
  @objc func addSample(_ id: String, url: String, settings: [String: NSNumber], callback: RCTResponseSenderBlock) {
    guard let fileURL = URL(string: url) else {
      print("Invalid URL string")
      return
    }
    
    if (samples.first(where: {$0.id == id}) != nil) {
      callback(["Sample already exists"])
      return
    }
    
    let volume = settings["volume"]!
    let pan = settings["pan"]!
    let reverb = settings["reverb"]!
    
    let settings = SampleSettings(volume: Float(truncating: volume), pan: Float(truncating: pan), reverb: Float(truncating: reverb))
    let sample = SampleModule(self.engine, id, fileURL, settings: settings)
    
    samples.append(sample)
    
    if !engine.isRunning {
      engine.prepare()
      try! engine.start()
    }
    
    callback([["id": id, "volume": volume, "pan": pan, "reverb": reverb]])
  }
  
  @objc func destroySample(_ id: String) {
    if let index = samples.firstIndex(where:{ $0.id == id}) {
      samples[index].destroy()
      samples.remove(at: index)
    }
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
      
      self.sendEvent(withName: SamplerEvents.VolumeUpdate.rawValue, body: ["value": value, "id": id])
    } else {
      print("Sample not found: \(id)")
    }
  }
  
  @objc func setSamplePan (_ id: String, value: Float) {
    if let sample = samples.first(where: { $0.id == id }) {
      sample.setPan(value)
      
      self.sendEvent(withName: SamplerEvents.PanUpdate.rawValue, body: ["value": value, "id": id])
    } else {
      print("Sample not found: \(id)")
    }
  }
  
  @objc func setSampleReverb (_ id: String, value: Float) {
    if let sample = samples.first(where: { $0.id == id }) {
      sample.setReverb(value)
      
      self.sendEvent(withName: SamplerEvents.ReverbUpdate.rawValue, body: ["value": value, "id": id])
    } else {
      print("Sample not found: \(id)")
    }
  }
  //
}
