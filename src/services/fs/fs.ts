import RNFS, {writeFile} from 'react-native-fs';
import {RemoveAudioInterface, SaveAudioInterface} from './fs.types';

class FSService {
  private _fs;
  private _samplesFolderPath;

  constructor() {
    this._fs = RNFS;
    this._samplesFolderPath = `${this.DocumentDirectoryPath}/uploaded-samples`;
  }

  get MainBundlePath() {
    return this._fs.MainBundlePath;
  }

  get DocumentDirectoryPath() {
    return this._fs.DocumentDirectoryPath;
  }

  get SamplesDirectoryPath() {
    return this._samplesFolderPath;
  }

  async saveAudio(data: SaveAudioInterface) {
    try {
      await RNFS.mkdir(this._samplesFolderPath);

      const nameWithFormat = `${data.id}.${data.format}`;
      const filePath = `${this._samplesFolderPath}/${nameWithFormat}`;

      try {
        await writeFile(filePath, data.binaryData, 'base64');

        console.log(
          'FSService.saveAudio: Audio file saved successfully: ',
          filePath,
        );
      } catch (error) {
        console.error('FSService.saveAudio: ', error);
      }

      return nameWithFormat;
    } catch (error) {
      throw `FSService.uploadAudio ${error}`;
    }
  }

  async removeAudio(data: RemoveAudioInterface) {
    try {
      const filePath = `${this._samplesFolderPath}/${data.path}`;

      console.log(filePath);
      if (await RNFS.exists(filePath)) {
        await RNFS.unlink(filePath);

        return true;
      }

      return false;
    } catch (error) {
      throw `FSService.removeAudio ${error}`;
    }
  }
}

const fsService = new FSService();

export {fsService};
