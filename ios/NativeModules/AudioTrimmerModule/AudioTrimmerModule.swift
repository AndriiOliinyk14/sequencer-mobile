
//
//  AudioTrimmerModule.swift
//  Sequencer 
//
//  Created by Andrii Oliinyk on 14.03.2025.
//

import Foundation
import AVFoundation
import React

@objc(AudioTrimmerModule)
class AudioTrimmerModule: NSObject {
  let engine: AVAudioEngine
  let audioFormat: String
  var audioSession: AVAudioSession = AVAudioSession.sharedInstance()
  var trimmedURL: URL?
  
  
  override init(){
    self.engine = AudioEngineModule.shared._engine
    let audioSession = AVAudioSession.sharedInstance()
    self.audioFormat = "wav"
    
    do {
      try audioSession.setCategory(.playback, mode: .default)
      try audioSession.setActive(true)
    } catch {
      print("AudioTrimmerModule: AudioSession went wrong: ", error)
    }
    
    super.init()
  }
  
  @objc
  func trim(_ filePath:String, startTime:Double, endTime:Double, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock){
    
    if (self.trimmedURL != nil) {
      self.cleanup()
    }
    
    let inputURL = URL(fileURLWithPath: filePath)
    let fileExtension = (filePath as NSString).pathExtension
    let fileName = ((filePath as NSString).lastPathComponent as NSString).deletingPathExtension
    let trimmedFileName = "\(fileName)_trimmed.\(fileExtension)"
    let outputFileURL = URL(fileURLWithPath: (filePath as NSString).deletingLastPathComponent).appendingPathComponent(trimmedFileName)
    
    let asset = AVAsset(url: inputURL)
    let composition = AVMutableComposition()
    let duration = asset.duration.seconds - startTime - endTime
    
    guard let audioTrack = asset.tracks(withMediaType: .audio).first else {
      rejecter("TRIM_ERROR", "Audio track not found", nil)
      return
    }
    
    let timeRange = CMTimeRangeMake(start: CMTimeMakeWithSeconds(startTime, preferredTimescale: 1000), duration: CMTimeMakeWithSeconds(duration, preferredTimescale: 1000))
    
    
    
    do {
      let compositionTrack = composition.addMutableTrack(withMediaType: .audio, preferredTrackID: kCMPersistentTrackID_Invalid)
      try compositionTrack?.insertTimeRange(timeRange, of: audioTrack, at: CMTime.zero)
      
      let exporter = AVAssetExportSession(asset: composition, presetName: AVAssetExportPresetAppleM4A)
      
      exporter?.outputURL = outputFileURL
      exporter?.outputFileType = .m4a
      trimmedURL = outputFileURL
      
      exporter?.exportAsynchronously {
        switch exporter?.status {
        case .completed:
          resolver(["path": outputFileURL.path, "duration": duration])
        case .failed:
          rejecter("EXPORT_ERROR", "Export failed", exporter?.error)
        case .cancelled:
          rejecter("EXPORT_ERROR", "Export cancelled", nil)
        default:
          rejecter("EXPORT_ERROR", "Unknown export error", nil)
        }
      }
    } catch {
      print("AudioTrimmerModule: trim went wrong: ", error)
      rejecter("TRIM_ERROR", "Failed to trim audio", error)
    }
  }
  
  @objc
  func cleanup(){
    guard let fileURL = trimmedURL else {
      print("No file to remove")
      return
    }
    
    if FileManager.default.fileExists(atPath: fileURL.path) {
      do {
        try FileManager.default.removeItem(at: fileURL)
        print("File removed")
      } catch {
        
        print("AudioTrimmerModule: cleanup went wrong: ", error)
      }
      
    }
  }
  
  deinit {
    self.cleanup()
  }
  
}
