import {NativeModules} from 'react-native';
import {SampleSettings} from '../../types';

interface SamplerInterface {
  addSample: (
    id: string,
    url: string,
    settings: SampleSettings,
    callback: (data: {
      id: string;
      volume: number;
      pan: number;
      reverb: number;
    }) => void,
  ) => void;
  playSample: (id: string) => void;
  setSampleVolume: (id: string, value: number) => void;
  setSampleReverb: (id: string, value: number) => void;
}

export const SamplerModule = NativeModules.SamplerModule as SamplerInterface;
