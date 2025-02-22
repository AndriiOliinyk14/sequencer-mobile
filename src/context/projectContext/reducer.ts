import {PROJECT_ACTION_TYPES} from './actionTypes';
import {initialState} from './initialState';
import {InitialState} from './types';

const reducer = (state: InitialState, action: any) => {
  switch (action.type) {
    case PROJECT_ACTION_TYPES.SET_PLAYER_STATUS:
      return {...state, playerStatus: action.payload};
    case PROJECT_ACTION_TYPES.UPDATE_PATTERNS:
      return {...state, patterns: action.payload};
    case PROJECT_ACTION_TYPES.REPLACE_SAMPLE:
    case PROJECT_ACTION_TYPES.REMOVE_SAMPLE:
      return {
        ...state,
        patterns: action.payload.patterns,
        samples: action.payload.samples,
      };
    case PROJECT_ACTION_TYPES.SET_SAMPLE:
      return {...state, samples: [...state.samples, action.payload]};
    case PROJECT_ACTION_TYPES.UPDATE_SAMPLE:
      return {...state, samples: action.payload};
    case PROJECT_ACTION_TYPES.SET_BPM:
      return {...state, bpm: action.payload};
    case PROJECT_ACTION_TYPES.SET_PATTERN_LENGTH:
      return {...state, patternLength: action.payload};
    case PROJECT_ACTION_TYPES.RESET_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
