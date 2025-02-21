//
//  Sampler.swift
//  Sequencer
//
//  Created by Andrii on 26.10.2024.
//

import Foundation
import AVFAudio
import React

struct SampleSettings {
  var volume: Float
  var pan: Float
  var reverb: Float
}


class SampleModule {
  var name: String
  var url: URL
  let file: AVAudioFile
  let engine: AVAudioEngine
  var player: AVAudioPlayerNode
  var reverb: AVAudioUnitReverb
  var audioBuffer: AVAudioPCMBuffer
  
  init(_ engine: AVAudioEngine, _ name: String, _ url: URL, settings: SampleSettings){
    self.engine = engine
    self.name = name
    self.url = url
    self.player = AVAudioPlayerNode()
    self.reverb = AVAudioUnitReverb()
    
    self.file = try! AVAudioFile(forReading: url)
    
    self.audioBuffer = AVAudioPCMBuffer(pcmFormat: file.processingFormat, frameCapacity: AVAudioFrameCount(file.length))!
    
    try! file.read(into: audioBuffer)
    
    reverb.wetDryMix = settings.reverb
    player.volume = settings.volume
    player.pan = settings.pan
    
    engine.attach(reverb)
    engine.attach(player)
    
    engine.connect(player, to: reverb, format: nil)
    engine.connect(reverb, to: engine.mainMixerNode, format: nil)
    
    player.prepare(withFrameCount: AVAudioFrameCount(file.length))
  }
  
  func play(){
    self.player.scheduleBuffer(self.audioBuffer, at: nil, options: .interrupts)
    self.player.play();
  }
  
  func setVolume(_ volume: Float){
    player.volume = volume
  }
  
  func setPan(_ pan: Float){
    player.pan = pan
  }
  
  
  func setReverb(_ reverb: Float){
    self.reverb.wetDryMix = reverb * 100
  }
}
