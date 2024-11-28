import {NativeModules} from 'react-native';

interface RecorderInterface {
  record: (name: string) => void;
  play: () => void;
  stop: (callback?: (data: string) => void) => void;
}

export const RecorderModule = NativeModules.RecorderModule as RecorderInterface;
