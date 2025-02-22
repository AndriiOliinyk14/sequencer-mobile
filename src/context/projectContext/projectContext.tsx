import React, {createContext, useContext, useReducer} from 'react';
import {CounterModule, SamplerModule} from '../../NativeModules';
import {fsService} from '../../services/fs';
import {Pattern, PlayerState, Sample, SampleSettings} from '../../types';
import {PROJECT_ACTION_TYPES} from './actionTypes';
import {initialState} from './initialState';
import reducer from './reducer';
import {ContextInterface} from './types';

const intitialSampleSettings = {
  volume: 1,
  pan: 0,
  reverb: 0,
};

const Context = createContext<ContextInterface>({
  state: initialState,
  actions: {
    setPlayerStatus: () => {},
    updatePattern: () => {},
    setPatterns: () => {},
    setSample: () => {},
    setRecordedSample: () => {},
    updateSample: () => {},
    replaceSample: () => {},
    removeSample: () => {},
    setBpm: () => {},
    setPatternLength: () => {},
    setInitialProject: () => {},
    resetState: () => {},
  },
});

export const ProjectContextProvider = ({children}: any) => {
  const path = fsService.MainBundlePath;

  const [state, dispatch] = useReducer(reducer, initialState);

  const setPlayerStatus = (status: PlayerState) => {
    dispatch({type: PROJECT_ACTION_TYPES.SET_PLAYER_STATUS, payload: status});
  };

  const updatePattern = (key: string, pattern: Pattern) => {
    dispatch({
      type: PROJECT_ACTION_TYPES.UPDATE_PATTERNS,
      payload: {...state.patterns, [key]: pattern},
    });
  };

  const setSample = (key: string, title: string, settings: SampleSettings) => {
    if (state.samples.some((item: any) => item.key === key)) {
      return;
    }

    SamplerModule.addSample(key, path + `/${key}.wav`, settings, () => {
      dispatch({
        type: PROJECT_ACTION_TYPES.SET_SAMPLE,
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
    console.log(filePath);
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
        type: PROJECT_ACTION_TYPES.REPLACE_SAMPLE,
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
        type: PROJECT_ACTION_TYPES.REMOVE_SAMPLE,
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
      type: PROJECT_ACTION_TYPES.UPDATE_SAMPLE,
      payload: samples,
    });
  };

  const setBpm = (bpm: number) => {
    dispatch({type: PROJECT_ACTION_TYPES.SET_BPM, payload: bpm});
  };

  const setPatternLength = (length: number) => {
    dispatch({type: PROJECT_ACTION_TYPES.SET_PATTERN_LENGTH, payload: length});
  };

  const setPatterns = (patterns: Record<string, Pattern>) => {
    dispatch({type: PROJECT_ACTION_TYPES.UPDATE_PATTERNS, payload: patterns});
  };

  const resetState = () => {
    dispatch({type: PROJECT_ACTION_TYPES.RESET_STATE});
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

  const actions = {
    setPlayerStatus,
    updatePattern,
    setPatterns,
    setSample,
    setRecordedSample,
    setInitialProject,
    updateSample,
    replaceSample,
    removeSample,
    setBpm,
    setPatternLength,
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

export const useProjectContext = () => useContext(Context);
