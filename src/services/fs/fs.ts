import RNFS, {writeFile} from 'react-native-fs';
import {SaveAudioInterface} from './fs.types';

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

      const fileName = `${data.id}.${data.format}`;
      const filePath = `${this._samplesFolderPath}/${fileName}`;

      try {
        await writeFile(filePath, data.binaryData, 'base64');

        console.log(
          'FSService.saveAudio: Audio file saved successfully: ',
          filePath,
        );
      } catch (error) {
        console.error('FSService.saveAudio: ', error);
      }

      return fileName;
    } catch (error) {
      throw `FSService.uploadAudio ${error}`;
    }
  }
}

const fsService = new FSService();

export {fsService};
