import {SAMPLES_ACTION_TYPES} from './actionsTypes';
import {InitialState} from './types';

const reducer = (state: InitialState, action: {type: string; payload: any}) => {
  switch (action.type) {
    case SAMPLES_ACTION_TYPES.SET_SAMPLES:
      return {...state, samples: action.payload};
    default:
      return state;
  }
};

export default reducer;
