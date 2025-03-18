import {NativeModules} from 'react-native';

interface RecorderModuleInterface {
  record: (id: string) => Promise<string>;
  cleanup: () => void;
  stop: () => Promise<{path: string; format: string}>;
}

class RecorderModule {
  private recorder: RecorderModuleInterface;

  constructor() {
    this.recorder = NativeModules.RecorderModule;
  }

  async record(id: string) {
    try {
      return await this.recorder.record(id);
    } catch (error) {
      console.log('RecorderModule.record', error);
    }
  }

  async stopRecording() {
    try {
      return await this.recorder.stop();
    } catch (error) {
      console.log('RecorderModule.stopRecording', error);
    }
  }

  async cleanup() {
    try {
      await this.recorder.cleanup();
    } catch (error) {
      console.log('RecorderModule.cleanup', error);
    }
  }
}

const recorderModule = new RecorderModule();

export {recorderModule};
