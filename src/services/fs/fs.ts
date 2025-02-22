import RNFS, {writeFile} from 'react-native-fs';
import {SaveAudioInterface} from './fs.types';
import uuid from 'react-native-uuid';

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

  async saveAudio(data: SaveAudioInterface) {
    try {
      await RNFS.mkdir(this._samplesFolderPath);
      const filePath = `${this._samplesFolderPath}/${data.id}.${data.format}`;

      try {
        await writeFile(filePath, data.binaryData, 'base64');

        console.log(
          'FSService.saveAudio: Audio file saved successfully: ',
          filePath,
        );
      } catch (error) {
        console.error('FSService.saveAudio: ', error);
      }

      return filePath;
    } catch (error) {
      throw `FSService.uploadAudio ${error}`;
    }
  }
}

const fsService = new FSService();

export {fsService};
