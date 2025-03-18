import {NativeModules} from 'react-native';
import {fsService} from '../../services';

interface AudioTrimmerModuleInterface {
  trim: (
    filePath: string,
    startTime: number,
    endTime: number,
  ) => {path: string; duration: number};
  play(): void;
  cleanup(): void;
}

class AudioTrimmerModule {
  private audioTrimmer: AudioTrimmerModuleInterface;

  constructor() {
    this.audioTrimmer =
      NativeModules.AudioTrimmerModule as AudioTrimmerModuleInterface;
  }

  async trim(
    filePath: string,
    startTime: number,
    endTime: number,
  ): Promise<{path: string; duration: number} | undefined> {
    try {
      const absolutePath = `${fsService.SamplesDirectoryPath}/${filePath}`;
      const response = await this.audioTrimmer.trim(
        absolutePath,
        startTime,
        endTime,
      );
      return response;
    } catch (error) {
      console.error('AudioTrimmerModule.trim: ', error);
    }
  }
}

const audioTrimmerModule = new AudioTrimmerModule();

export {audioTrimmerModule};
