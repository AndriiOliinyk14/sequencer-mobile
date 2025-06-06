import {DialogEnum, PlayerState} from '../../types';

const initialState = {
  playerStatus: PlayerState.STOPPED,
  patterns: {},
  samples: [],
  bpm: 128,
  patternLength: 16,
  dialogs: {
    [DialogEnum.ICONS_LIBRARY]: {
      visible: false,
    },
    [DialogEnum.NEW_PROJECT]: {
      visible: false,
    },
    [DialogEnum.ADD_RECORD_SAMPLE]: {
      visible: false,
    },
    [DialogEnum.PROJECT_SETTINGS]: {
      visible: false,
    },
  },
};

export {initialState};
