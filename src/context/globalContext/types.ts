import {DialogEnum} from '../../types';
import {PlayerState} from '../../types/enums/PlayerStatus';

export interface InitialState {
  playerStatus: PlayerState;
  dialogs: {
    [key in DialogEnum]: {
      visible: boolean;
      options?: any;
    };
  };
}

export interface ContextInterface {
  state: InitialState;
  actions: {
    openDialog: (name: string, data?: any) => void;
    closeDialog: (name: string) => void;
    resetState: () => void;
  };
}
