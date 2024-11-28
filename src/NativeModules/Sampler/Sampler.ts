import {NativeModules} from 'react-native';
import {SampleSettings} from '../../types';

interface SamplerInterface {
  addSample: (
    name: string,
    url: string,
    settings: SampleSettings,
    callback: (data: {
      key: string;
      volume: number;
      pan: number;
      reverb: number;
    }) => void,
  ) => void;
  playSample: (name: string) => void;
  setSampleVolume: (name: string, volume: number) => void;
}

export const SamplerModule = NativeModules.SamplerModule as SamplerInterface;
