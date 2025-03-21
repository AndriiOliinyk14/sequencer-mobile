//
//  PlayerModule.swift
//  Sequencer
//
//  Created by Andrii Oliinyk on 17.03.2025.
//

import Foundation
import AVFAudio

@objc(PlayerModule)
class PlayerModule:NSObject{
  var engine:AVAudioEngine
  var url:URL? = nil
  var player:AVAudioPlayerNode
  var audioSession: AVAudioSession = AVAudioSession.sharedInstance()
  var audioFormat: String
  var audioBuffer: AVAudioPCMBuffer?
  
  override init(){
    self.engine = AudioEngineModule.shared._engine
    self.audioSession = AVAudioSession.sharedInstance()
    self.audioFormat = "wav"
    self.player = AVAudioPlayerNode()
    
    self.engine.attach(self.player)
    
    do {
      try audioSession.setCategory(.playback, mode: .default)
      try audioSession.setActive(true)
      
    } catch {
      print(error)
    }
    
    super.init()
    
  }
  
  @objc
  func load(_ url:String, resolver:RCTPromiseResolveBlock, rejecter: RCTPromiseRejectBlock){
    let fileURL = URL(fileURLWithPath: url)
    
    
    guard FileManager.default.fileExists(atPath: fileURL.path) else {
      print("File does not exist at path: \(fileURL.path)")
      rejecter("ERROR", "PlayerModule.load: File does not exist at path", nil)
      return
    }
    
    let file = try! AVAudioFile(forReading: fileURL)
    self.audioBuffer = AVAudioPCMBuffer(pcmFormat: file.processingFormat, frameCapacity: AVAudioFrameCount(file.length))!
    try! file.read(into: self.audioBuffer!)
    
    self.engine.connect(player, to: engine.mainMixerNode, format: file.processingFormat)
    self.player.prepare(withFrameCount: AVAudioFrameCount(file.length))
    
    
    let properties: [String: Any] = [
      "duration": Double(file.length) / file.processingFormat.sampleRate,
    ]
    
    resolver(properties)
  }
  
  @objc
  func play(){
    
    if let buffer = self.audioBuffer {
      // Ensure that the player is not already playing
      if self.player.isPlaying {
        self.player.stop()
      }
      
      // Schedule the buffer
      self.player.scheduleBuffer(buffer, at: nil, options: .interrupts, completionHandler: self.stop)
      
      // Start playing the audio
      self.player.play()
      
    }
  }
  
  @objc
  func stop(){
    DispatchQueue.main.async {
      if self.player.isPlaying {
        self.player.stop()
      }
    }
  }
  
  @objc
  func cleanup(){
    self.url = nil
    self.engine.detach(self.player)
  }
}
