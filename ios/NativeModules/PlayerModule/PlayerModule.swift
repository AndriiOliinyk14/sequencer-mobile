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
  func play(_ url:String){
    print("url",url)
    let fileURL = URL(fileURLWithPath: url)
    
    guard FileManager.default.fileExists(atPath: fileURL.path) else {
      print("File does not exist at path: \(fileURL.path)")
      return
    }
    
    let file = try! AVAudioFile(forReading: fileURL)
    let audioBuffer = AVAudioPCMBuffer(pcmFormat: file.processingFormat, frameCapacity: AVAudioFrameCount(file.length))!
    try! file.read(into: audioBuffer)
    
    self.engine.connect(player, to: engine.mainMixerNode, format: file.processingFormat)
    self.player.prepare(withFrameCount: AVAudioFrameCount(file.length))
    self.player.scheduleBuffer(audioBuffer, at: nil, options: .interrupts)
    self.player.play()
  }
  
  @objc
  func stop(){
    player.stop()
  }
  
  //  @objc
  //  func getCurrentPosition() -> TimeInterval? {
  //    guard let nodeTime = player.lastRenderTime,
  //          let playerTime = player.playerTime(forNodeTime: nodeTime) else {
  //      return nil
  //    }
  //
  //    return TimeInterval(playerTime.sampleTime) / playerTime.sampleRate
  //  }
  
  @objc
  func cleanup(){
    self.url = nil
    self.engine.detach(self.player)
  }
}
