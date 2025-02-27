import {PlayerState} from '../../types';
import {InitialState} from './types';

const initialState: InitialState = {
  id: '',
  name: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  playerStatus: PlayerState.STOPPED,
  patterns: {},
  samples: [],
  bpm: 128,
  patternLength: 16,
};

export {initialState};
