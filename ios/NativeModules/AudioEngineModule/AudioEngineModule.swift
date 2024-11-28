//
//  AudioPlayerModule.swift
//  Sequencer
//
//  Created by Andrii on 27.11.2024.
//

import Foundation
import AVFAudio
import React


class AudioEngineModule {
  static let shared = AudioEngineModule()
  var _engine: AVAudioEngine = AVAudioEngine()
  private var _session: AVAudioSession
  private var _mixerNode: AVAudioMixerNode
  
  init(){
    _engine = AVAudioEngine()
    _session = AVAudioSession.sharedInstance()
    _mixerNode = AVAudioMixerNode()
    
    do {
      try _session.setCategory(.playback, mode: .default)
      try _session.setActive(true)
      
      _engine.attach(_mixerNode)
      _engine.connect(_mixerNode, to: _engine.mainMixerNode, format: nil)
      
      do {
        _engine.prepare()
        try _engine.start()
        print("_engine.isRunning", _engine.isRunning)
      } catch {
        print(error)
      }
      
    } catch {
      print("AudioEngineModule initialization error: \(error)")
    }
  }
}
