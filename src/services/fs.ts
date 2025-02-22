import RNFS, {writeFile} from 'react-native-fs';

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

  async saveAudio(fileName: string, format: 'wav' = 'wav', fileBinary: string) {
    try {
      await RNFS.mkdir(this._samplesFolderPath);

      let counter = 1;

      let filePath = `${this._samplesFolderPath}/${fileName}`;

      while (await RNFS.exists(filePath)) {
        filePath = `${filePath}_${counter}`;
        counter++;
      }

      const filePathWithFormat = `${filePath}.${format}`;
      await writeFile(filePathWithFormat, fileBinary, 'base64');

      console.log('Audio file saved successfully: ', filePathWithFormat);
      return filePathWithFormat;
    } catch (error) {
      throw `FSService.uploadAudio ${error}`;
    }
  }
}

const fsService = new FSService();

export {fsService};
