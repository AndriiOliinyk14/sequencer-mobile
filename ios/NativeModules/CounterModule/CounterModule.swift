//
//  Interval.swift
//  Sequencer
//
//  Created by Andrii on 20.11.2024.
//

import Foundation

@objc(CounterModule)
class CounterModule:RCTEventEmitter {
  private var timer:Timer?
  private var count: Int = 0
  private var bpm:Double = 128.0
  private var patternLength:Int = 16
  
  override func supportedEvents() -> [String]! {
    return ["TimerUpdate"]
  }
  
  @objc func setBpm(_ bpm:NSNumber){
    self.bpm = bpm.doubleValue
  }
  
  @objc func setPatternLength(_ patternLength:Int){
    self.patternLength = patternLength
  }
  
  
  @objc func start(){
    self.stop()
    
    let intervalValue = 60 / self.bpm / 4
    
    func increaseCount(){
      
      if self.count >= self.patternLength {
        self.count = 0
      }
      
      self.count += 1
      self.sendEvent(withName: "TimerUpdate", body: ["count": self.count])
    }
    
    
    
    DispatchQueue.main.async {
      self.timer = Timer.scheduledTimer(withTimeInterval: intervalValue, repeats: true) { _ in
        increaseCount()
      }
      
      RunLoop.main.add(self.timer!, forMode: .common)
    }
  }
  
  @objc func stop() {
    self.timer?.invalidate()
    self.timer = nil
    self.count = 0
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
