import {DialogEnum, PlayerState} from '../../types';

const initialState = {
  playerStatus: PlayerState.STOPPED,
  patterns: {},
  samples: [],
  bpm: 128,
  patternLength: 16,
  dialogs: {
    [DialogEnum.RECORD]: {
      visible: false,
    },
    [DialogEnum.NEW_PROJECT]: {
      visible: false,
    },
    [DialogEnum.ADD_SAMPLE]: {
      visible: false,
    },
    [DialogEnum.ADD_RECORD_SAMPLE]: {
      visible: false,
    },
  },
};

export {initialState};
