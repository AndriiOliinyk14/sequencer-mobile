import React, {createContext, useContext, useReducer} from 'react';
import {DialogEnum, Sample, SampleSettings} from '../types';
import {PlayerState} from '../types/PlayerStatus';
import {CounterModule, SamplerModule} from '../NativeModules';
import RNFS from 'react-native-fs';

type Pattern = {[key: string]: {isOn: boolean}[]};

interface InitialState {
  playerStatus: PlayerState;
  patterns: {
    [key: string]: {
      isOn: boolean;
    }[];
  };
  samples: Sample[];
  bpm: number;
  patternLength: number;
  dialogs: {
    [key in DialogEnum]: {
      visible: boolean;
    };
  };
}

interface ContextInterface {
  state: InitialState;
  actions: {
    updatePattern: (key: string, pattern: Pattern) => void;
    setPatterns: (patterns: Record<string, Pattern>) => void;
    setPlayerStatus: (status: PlayerState) => void;
    setSample: (key: string, title: string, settings: SampleSettings) => void;
    updateSample: (key: string, data: Partial<SampleSettings>) => void;
    setBpm: (bpm: number) => void;
    setPatternLength: (length: number) => void;
    setInitialProject: (
      patterns: Record<string, Pattern>,
      samples: Sample[],
      bpm: number,
      patternLength: number,
    ) => void;
    openDialog: (name: string) => void;
    closeDialog: (name: string) => void;
  };
}

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
  },
};

export const Context = createContext<ContextInterface>({
  state: initialState,
  actions: {
    updatePattern: () => {},
    setPatterns: () => {},
    setPlayerStatus: () => {},
    setSample: () => {},
    updateSample: () => {},
    setBpm: () => {},
    setPatternLength: () => {},
    setInitialProject: () => {},
    openDialog: () => {},
    closeDialog: () => {},
  },
});

export const GLOBAL_ACTION_TYPES = {
  SET_PLAYER_STATUS: 'SET_PLAYER_STATUS',
  SET_COUNT: 'SET_COUNT',
  UPDATE_PATTERN: 'UPDATE_PATTERN',
  SET_SAMPLE: 'SET_SAMPLE',
  UPDATE_SAMPLE: 'UPDATE_SAMPLE',
  SET_BPM: 'SET_BPM',
  SET_PATTERN_LENGTH: 'SET_PATTERN_LENGTH',
  SET_PATTERNS: 'SET_PATTERNS',
  OPEN_DIALOG: 'OPEN_DIALOG',
  CLOSE_DIALOG: 'CLOSE_DIALOG',
};

const reducer = (state: InitialState, action: any) => {
  switch (action.type) {
    case GLOBAL_ACTION_TYPES.SET_PLAYER_STATUS:
      return {...state, playerStatus: action.payload};
    case GLOBAL_ACTION_TYPES.SET_COUNT:
      return {...state, count: action.payload};
    case GLOBAL_ACTION_TYPES.UPDATE_PATTERN:
      return {...state, patterns: action.payload};
    case GLOBAL_ACTION_TYPES.SET_SAMPLE:
      return {...state, samples: [...state.samples, action.payload]};
    case GLOBAL_ACTION_TYPES.UPDATE_SAMPLE:
      return {...state, samples: action.payload};
    case GLOBAL_ACTION_TYPES.SET_BPM:
      return {...state, bpm: action.payload};
    case GLOBAL_ACTION_TYPES.SET_PATTERN_LENGTH:
      return {...state, patternLength: action.payload};
    case GLOBAL_ACTION_TYPES.OPEN_DIALOG:
      return {
        ...state,
        dialogs: {...state.dialogs, [action.payload.name]: {visible: true}},
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

export const ContextProvider = ({children}: any) => {
  const path = RNFS.MainBundlePath;

  const [state, dispatch] = useReducer(reducer, initialState);

  const updatePattern = (key: string, pattern: Pattern) => {
    dispatch({
      type: GLOBAL_ACTION_TYPES.UPDATE_PATTERN,
      payload: {...state.patterns, [key]: pattern},
    });
  };

  const setPlayerStatus = (status: PlayerState) => {
    dispatch({type: GLOBAL_ACTION_TYPES.SET_PLAYER_STATUS, payload: status});
  };

  const setSample = (key: string, title: string, settings: SampleSettings) => {
    if (state.samples.some((item: any) => item.key === key)) {
      return;
    }

    SamplerModule.addSample(key, path + `/${key}.wav`, settings, () => {
      dispatch({
        type: GLOBAL_ACTION_TYPES.SET_SAMPLE,
        payload: {key, title, settings},
      });

      updatePattern(key);
    });
  };

  const updateSample = (key: string, data: Partial<SampleSettings>) => {
    const samples = state.samples.map((sample: Sample) => {
      if (sample.key === key) {
        return {...sample, settings: {...sample.settings, ...data}};
      }

      return sample;
    });

    dispatch({
      type: GLOBAL_ACTION_TYPES.UPDATE_SAMPLE,
      payload: samples,
    });
  };

  const setBpm = (bpm: number) => {
    dispatch({type: GLOBAL_ACTION_TYPES.SET_BPM, payload: bpm});
  };

  const setPatternLength = (length: number) => {
    dispatch({type: GLOBAL_ACTION_TYPES.SET_PATTERN_LENGTH, payload: length});
  };

  const setPatterns = (patterns: Record<string, Pattern>) => {
    dispatch({type: GLOBAL_ACTION_TYPES.SET_PATTERNS, payload: patterns});
  };

  const setInitialProject = (
    patterns: Record<string, Pattern>,
    samples: Sample[],
    bpm: number,
    patternLength: number,
  ) => {
    setPatterns(patterns);
    setBpm(bpm);
    setPatternLength(patternLength);

    samples.forEach(sample => {
      setSample(sample.key, sample.title!, sample.settings);
    });

    CounterModule.setPatternLength(patternLength);
    CounterModule.setBpm(bpm);
  };

  const openDialog = (name: string) => {
    dispatch({
      type: GLOBAL_ACTION_TYPES.OPEN_DIALOG,
      payload: {name},
    });
  };

  const closeDialog = (name: string) => {
    dispatch({
      type: GLOBAL_ACTION_TYPES.CLOSE_DIALOG,
      payload: {name},
    });
  };

  const actions = {
    updatePattern,
    setPatterns,
    setPlayerStatus,
    setSample,
    setInitialProject,
    updateSample,
    setBpm,
    setPatternLength,
    openDialog,
    closeDialog,
  };

  return (
    <Context.Provider
      value={{
        state,
        actions,
      }}>
      {children}
    </Context.Provider>
  );
};

export const useGlobalContext = () => useContext(Context);
