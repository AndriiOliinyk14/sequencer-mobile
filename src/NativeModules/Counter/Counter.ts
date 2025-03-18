import {NativeEventEmitter, NativeModules} from 'react-native';

interface CounterModuleInterface {
  start: () => void;
  stop: () => void;
  setPatternLength: (value: number) => void;
  setBpm: (value: number) => void;
}
export const counterEmitter = new NativeEventEmitter(
  NativeModules.CounterModule,
);

class CounterModule {
  private counter: CounterModuleInterface;

  constructor() {
    this.counter = NativeModules.CounterModule;
  }

  start() {
    this.counter.start();
  }

  stop() {
    this.counter.stop();
  }

  setPatternLength(value: number) {
    this.counter.setPatternLength(value);
  }

  setBpm(value: number) {
    this.counter.setBpm(value);
  }
}

const counterModule = new CounterModule();

export {counterModule};
