import {NativeEventEmitter, NativeModules} from 'react-native';
import {SampleSettings} from '../../types';

type ReturnData = {
  id: string;
  volume: number;
  pan: number;
  reverb: number;
};

interface SamplerModuleInterface {
  addSample: (
    id: string,
    url: string,
    settings: SampleSettings,
  ) => ReturnData[];
  playSample: (id: string) => void;
  destroySample: (id: string) => void;

  setSampleVolume: (id: string, value: number) => void;
  setSamplePan: (id: string, value: number) => void;
  setSampleReverb: (id: string, value: number) => void;
}

export const samplerEmitter = new NativeEventEmitter(
  NativeModules.SamplerModule,
);

class SamplerModule {
  private samplerModule: SamplerModuleInterface;
  constructor() {
    this.samplerModule = NativeModules.SamplerModule;
  }

  async addSample(
    id: string,
    url: string,
    settings: SampleSettings,
  ): Promise<ReturnData | undefined> {
    try {
      const response = await this.samplerModule.addSample(id, url, settings);
      return response[0];
    } catch (error) {
      console.log('SamplerModule.addSample: ', error);
    }
  }

  async playSample(id: string) {
    try {
      await this.samplerModule.playSample(id);
    } catch (error) {
      console.log('SamplerModule.playSample: ', error);
    }
  }

  async setSampleVolume(id: string, value: number) {
    try {
      await this.samplerModule.setSampleVolume(id, value);
    } catch (error) {
      console.log('SamplerModule.setSampleVolume: ', error);
    }
  }

  async setSamplePan(id: string, value: number) {
    try {
      await this.samplerModule.setSamplePan(id, value);
    } catch (error) {
      console.log('SamplerModule.setSamplePan: ', error);
    }
  }

  async setSampleReverb(id: string, value: number) {
    try {
      await this.samplerModule.setSampleReverb(id, value);
    } catch (error) {
      console.log('SamplerModule.setSampleReverb: ', error);
    }
  }

  async destroySample(id: string) {
    try {
      await this.samplerModule.destroySample(id);
    } catch (error) {
      console.log('SamplerModule.destroySample: ', error);
    }
  }
}

export const samplerModule = new SamplerModule();
