import React, {createContext, useContext, useReducer} from 'react';
import RNFS from 'react-native-fs';
import {CounterModule, SamplerModule} from '../NativeModules';
import {DialogEnum, Sample, SampleSettings} from '../types';
import {PlayerState} from '../types/PlayerStatus';

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
      options?: any;
    };
  };
}

const intitialSampleSettings = {
  volume: 1,
  pan: 0,
  reverb: 0,
};

interface ContextInterface {
  state: InitialState;
  actions: {
    updatePattern: (key: string, pattern: Pattern) => void;
    setPatterns: (patterns: Record<string, Pattern>) => void;
    setPlayerStatus: (status: PlayerState) => void;
    setSample: (key: string, title: string, settings: SampleSettings) => void;
    setRecordedSample: (
      title: string,
      filePath: string,
      settings: SampleSettings,
    ) => void;
    updateSample: (key: string, data: Partial<SampleSettings>) => void;
    replaceSample: (oldKey: string, newKey: string, newTitle: string) => void;
    removeSample: (key: string) => void;
    setBpm: (bpm: number) => void;
    setPatternLength: (length: number) => void;
    setInitialProject: (
      patterns: Record<string, Pattern>,
      samples: Sample[],
      bpm: number,
      patternLength: number,
    ) => void;
    openDialog: (name: string, data?: any) => void;
    closeDialog: (name: string) => void;
    resetState: () => void;
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
    setRecordedSample: () => {},
    updateSample: () => {},
    replaceSample: () => {},
    removeSample: () => {},
    setBpm: () => {},
    setPatternLength: () => {},
    setInitialProject: () => {},
    openDialog: () => {},
    closeDialog: () => {},
    resetState: () => {},
  },
});

export const GLOBAL_ACTION_TYPES = {
  SET_PLAYER_STATUS: 'SET_PLAYER_STATUS',
  SET_COUNT: 'SET_COUNT',
  UPDATE_PATTERNS: 'UPDATE_PATTERNS',
  SET_SAMPLE: 'SET_SAMPLE',
  UPDATE_SAMPLE: 'UPDATE_SAMPLE',
  REPLACE_SAMPLE: 'REPLACE_SAMPLE',
  REMOVE_SAMPLE: 'REMOVE_SAMPLE',
  SET_BPM: 'SET_BPM',
  SET_PATTERN_LENGTH: 'SET_PATTERN_LENGTH',
  OPEN_DIALOG: 'OPEN_DIALOG',
  CLOSE_DIALOG: 'CLOSE_DIALOG',
  RESET_STATE: 'RESET_STATE',
};

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

export const ContextProvider = ({children}: any) => {
  const path = RNFS.MainBundlePath;

  const [state, dispatch] = useReducer(reducer, initialState);

  const updatePattern = (key: string, pattern: Pattern) => {
    dispatch({
      type: GLOBAL_ACTION_TYPES.UPDATE_PATTERNS,
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
    });
  };

  const setRecordedSample = (
    title: string,
    filePath: string,
    settings: SampleSettings,
  ) => {
    const addSample = (data: any) => {
      actions.setSample(data.key, data.key, {
        volume: data.volume,
        pan: data.pan,
        reverb: data.reverb,
      });
    };

    SamplerModule.addSample(title, filePath, settings, addSample);
  };

  const replaceSample = (oldKey: string, newKey: string, newTitle: string) => {
    const sampleIndex = (state.samples as Array<any>).findIndex(
      item => item.key === oldKey,
    );

    if (sampleIndex >= 0) {
      const newSamples = state.samples;

      newSamples[sampleIndex] = {
        ...newSamples[sampleIndex],
        key: newKey,
        title: newTitle,
      };

      const newPatterns = {
        ...state.patterns,
        [newKey]: state.patterns[oldKey],
      };

      delete newPatterns[oldKey];

      SamplerModule.addSample(
        newKey,
        path + `/${newKey}.wav`,
        intitialSampleSettings,
        () => {},
      );

      dispatch({
        type: GLOBAL_ACTION_TYPES.REPLACE_SAMPLE,
        payload: {samples: newSamples, patterns: newPatterns},
      });
    }
  };

  const removeSample = (key: string) => {
    const sampleIndex = (state.samples as Array<any>).findIndex(
      item => item.key === key,
    );

    if (sampleIndex >= 0) {
      const newSamples = [...state.samples];
      newSamples.splice(sampleIndex, 1);

      const newPatterns = {
        ...state.patterns,
      };

      delete newPatterns[key];

      dispatch({
        type: GLOBAL_ACTION_TYPES.REMOVE_SAMPLE,
        payload: {samples: newSamples, patterns: newPatterns},
      });
    }
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
    dispatch({type: GLOBAL_ACTION_TYPES.UPDATE_PATTERNS, payload: patterns});
  };

  const resetState = () => {
    dispatch({type: GLOBAL_ACTION_TYPES.RESET_STATE});
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

  const openDialog = (name: string, data?: any) => {
    dispatch({
      type: GLOBAL_ACTION_TYPES.OPEN_DIALOG,
      payload: {name, options: data},
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
    setRecordedSample,
    setInitialProject,
    updateSample,
    replaceSample,
    removeSample,
    setBpm,
    setPatternLength,
    openDialog,
    closeDialog,
    resetState,
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
