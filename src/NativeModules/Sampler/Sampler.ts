import {NativeEventEmitter, NativeModules} from 'react-native';
import {SampleSettings} from '../../types';

type CallbackData = {
  id: string;
  volume: number;
  pan: number;
  reverb: number;
};

interface SamplerInterface {
  addSample: (
    id: string,
    url: string,
    settings: SampleSettings,
    callback: (data: CallbackData | string) => void,
  ) => void;
  destroySample: (id: string) => void;
  playSample: (id: string) => void;

  setSampleVolume: (id: string, value: number) => void;
  setSamplePan: (id: string, value: number) => void;
  setSampleReverb: (id: string, value: number) => void;
}

export const samplerEmitter = new NativeEventEmitter(
  NativeModules.SamplerModule,
);

export const SamplerModule = NativeModules.SamplerModule as SamplerInterface;
