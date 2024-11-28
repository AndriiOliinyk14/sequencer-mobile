import {NativeEventEmitter, NativeModules} from 'react-native';

interface CounterInterface {
  start: () => void;
  stop: () => void;
  setPatternLength: (value: number) => void;
  setBpm: (value: number) => void;
}
export const counterEmitter = new NativeEventEmitter(NativeModules.CounterModule);

export const CounterModule = NativeModules.CounterModule as CounterInterface;
