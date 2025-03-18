import {NativeModules} from 'react-native';

interface PlayerModuleInterface {
  play: (url: string) => void;
  stop: () => void;
  cleanup: () => void;
}

class PlayerModule {
  private player: PlayerModuleInterface;

  constructor() {
    this.player = NativeModules.PlayerModule as PlayerModuleInterface;
  }

  play(url: string) {
    try {
      this.player.play(url);
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
