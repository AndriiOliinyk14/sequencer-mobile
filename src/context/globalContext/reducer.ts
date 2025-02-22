import {GLOBAL_ACTION_TYPES} from './actionTypes';
import {initialState} from './initialState';
import {InitialState} from './types';

const reducer = (state: InitialState, action: any) => {
  switch (action.type) {
    case GLOBAL_ACTION_TYPES.SET_PLAYER_STATUS:
      return {...state, playerStatus: action.payload};
    case GLOBAL_ACTION_TYPES.SET_COUNT:
      return {...state, count: action.payload};
    case GLOBAL_ACTION_TYPES.UPDATE_PATTERNS:
      return {...state, patterns: action.payload};
    case GLOBAL_ACTION_TYPES.REPLACE_SAMPLE:
    case GLOBAL_ACTION_TYPES.REMOVE_SAMPLE:
      return {
        ...state,
        patterns: action.payload.patterns,
        samples: action.payload.samples,
      };
    case GLOBAL_ACTION_TYPES.SET_SAMPLE:
      return {...state, samples: [...state.samples, action.payload]};
    case GLOBAL_ACTION_TYPES.UPDATE_SAMPLE:
      return {...state, samples: action.payload};
    case GLOBAL_ACTION_TYPES.SET_BPM:
      return {...state, bpm: action.payload};
    case GLOBAL_ACTION_TYPES.SET_PATTERN_LENGTH:
      return {...state, patternLength: action.payload};
    case GLOBAL_ACTION_TYPES.RESET_STATE:
      return initialState;
    case GLOBAL_ACTION_TYPES.OPEN_DIALOG:
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          [action.payload.name]: {
            visible: true,
            options: action.payload.options,
          },
        },
      };
    case GLOBAL_ACTION_TYPES.CLOSE_DIALOG:
      return {
        ...state,
        dialogs: {...state.dialogs, [action.payload.name]: {visible: false}},
      };
    default:
      return state;
  }
};

export default reducer;
