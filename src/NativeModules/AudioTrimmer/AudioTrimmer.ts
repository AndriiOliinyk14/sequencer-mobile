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

const audioTrimmer =
  NativeModules.AudioTrimmerModule as AudioTrimmerModuleInterface;

class AudioTrimmerModule {
  constructor() {}

  async trim(
    filePath: string,
    startTime: number,
    endTime: number,
  ): Promise<{path: string; duration: number} | undefined> {
    try {
      const absolutePath = `${fsService.SamplesDirectoryPath}/${filePath}`;
      const response = await audioTrimmer.trim(
        absolutePath,
        startTime,
        endTime,
      );

      return response;
    } catch (error) {
      console.error('AudioTrimmerModule.trim: ', error);
    }
  }

  async play() {
    try {
      await audioTrimmer.play();
    } catch (error) {
      console.error('AudioTrimmerModule.play ', error);
    }
  }
}

const audioTrimmerModule = new AudioTrimmerModule();

export {audioTrimmerModule};
