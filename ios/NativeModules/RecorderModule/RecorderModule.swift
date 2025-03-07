//
//  RecorderModule.swift
//  Sequencer
//
//  Created by Andrii on 26.11.2024.
//

import Foundation
import AVFAudio


@objc(RecorderModule)
class RecorderModule:NSObject {
  let engine: AVAudioEngine
  var audioRecorder: AVAudioRecorder?
  let audioFormat: String
  var audioSession: AVAudioSession = AVAudioSession.sharedInstance()
  var recordingURL: URL?
  
  override init(){
    
    self.engine = AudioEngineModule.shared._engine
    let audioSession = AVAudioSession.sharedInstance()
    self.audioFormat = "wav"
    
    do {
      try audioSession.setCategory(.playback, mode: .default)
      try audioSession.setActive(true)
      
    } catch {
      
    }
  
    super.init()
  }
  
  @objc
  func record(_ name: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    let documentsPath = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    let fileURL = documentsPath.appendingPathComponent("\(name).wav")
    
    
    if FileManager.default.fileExists(atPath: fileURL.path) {
      do {
        try FileManager.default.removeItem(at: fileURL)
        print("File removed")
      } catch {
        print("Error removing file: \(error)")
      }
      
    }
    
    
    self.recordingURL = fileURL
    
    let settings:[String : Any] = [
      AVFormatIDKey: kAudioFormatLinearPCM,
      AVSampleRateKey: 44100,
      AVNumberOfChannelsKey: 2,
      AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
    ]
    
    do {
      try audioSession.setCategory(.playAndRecord, mode: .default, options: .defaultToSpeaker)
      try audioSession.setActive(true)
      
      audioRecorder = try AVAudioRecorder(url: fileURL, settings:settings)
      audioRecorder?.prepareToRecord()
      audioRecorder?.record()
      resolver(["status":"OK"])
    } catch {
      rejecter("RECORD_ERROR", "Failed to start recording", error)
    }
  }
  
  @objc
  func stop(_ callback: RCTResponseSenderBlock) {    
    guard let recorder = audioRecorder, recorder.isRecording else {
      print("No active recording")
      return
    }
    
    recorder.stop()
    
    if let fileURL = recordingURL {
      callback([["path": fileURL.relativePath, "format": self.audioFormat]])
    }
  }
  
  @objc
  func play() {
    guard let fileURL = recordingURL else {
      print("No recording to play")
      return
    }
    
    guard FileManager.default.fileExists(atPath: fileURL.path) else {
      print("File does not exist at path: \(fileURL.path)")
      return
    }
    
    let player = AVAudioPlayerNode()
    let file = try! AVAudioFile(forReading: fileURL)
    
    let audioBuffer = AVAudioPCMBuffer(pcmFormat: file.processingFormat, frameCapacity: AVAudioFrameCount(file.length))!
    
    try! file.read(into: audioBuffer)
    
    self.engine.attach(player)
    
    self.engine.connect(player, to: engine.mainMixerNode, format: file.processingFormat)
    
    player.prepare(withFrameCount: AVAudioFrameCount(file.length))
    
    player.scheduleBuffer(audioBuffer, at: nil, options: .interrupts) //
    player.play()
  }
  
  @objc
  func cleanup(){
    guard let fileURL = recordingURL else {
      print("No file to remove")
      return
    }
    
    if FileManager.default.fileExists(atPath: fileURL.path) {
      do {
        try FileManager.default.removeItem(at: fileURL)
        print("File removed")
      } catch {
        print("Error removing file: \(error)")
      }
      
    }
  }
}
