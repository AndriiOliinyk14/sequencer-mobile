import {NativeModules} from 'react-native';

interface PlayerModuleInterface {
  load: (url: string) => any;
  play: () => void;
  stop: () => void;
  cleanup: () => void;
  getCurrentPosition: () => void;
}

class PlayerModule {
  private player: PlayerModuleInterface;

  constructor() {
    this.player = NativeModules.PlayerModule as PlayerModuleInterface;
  }

  async load(url: string) {
    try {
      return await this.player.load(url);
    } catch (error) {
      console.log('PlayerModule.play', error);
    }
  }

  play() {
    try {
      this.player.play();
    } catch (error) {
      console.log('PlayerModule.play', error);
    }
  }

  stop() {
    try {
      this.player.stop();
    } catch (error) {
      console.log('PlayerModule.stop', error);
    }
  }

  cleanup() {
    try {
      this.player.cleanup();
    } catch (error) {
      console.log('PlayerModule.cleanup', error);
    }
  }
}

const playerModule = new PlayerModule();

export {playerModule};
