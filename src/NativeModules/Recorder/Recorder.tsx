import {NativeModules} from 'react-native';

interface RecorderInterface {
  record: (id: string) => void;
  play: () => void;
  cleanup: () => void;
  stop: (
    callback?: ({path, format}: {path: string; format: string}) => void,
  ) => void;
}

export const RecorderModule = NativeModules.RecorderModule as RecorderInterface;
