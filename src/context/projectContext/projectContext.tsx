import React, {createContext, useContext, useReducer} from 'react';
import {CounterModule, SamplerModule} from '../../NativeModules';

import {fsService} from '../../services';
import {
  Pattern,
  PlayerState,
  Project,
  Sample,
  SampleSettings,
} from '../../types';
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
    setProject: () => {},
    resetState: () => {},
  },
});

export const ProjectContextProvider = ({children}: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setPlayerStatus = (status: PlayerState) => {
    if (status === PlayerState.PLAYING) {
      CounterModule.start();
    } else {
      CounterModule.stop();
    }

    dispatch({type: PROJECT_ACTION_TYPES.SET_PLAYER_STATUS, payload: status});
  };

  const updatePattern = (key: string, pattern: Pattern) => {
    dispatch({
      type: PROJECT_ACTION_TYPES.UPDATE_PATTERNS,
      payload: {...state.patterns, [key]: pattern},
    });
  };

  const setSample = (
    id: string,
    title: string,
    path: string,
    settings: SampleSettings | undefined = intitialSampleSettings,
  ) => {
    const absolutePath = `${fsService.SamplesDirectoryPath}/${path}`;

    if (state.samples.some((item: any) => item.title === title)) {
      return;
    }

    SamplerModule.addSample(id, absolutePath, settings, props => {
      dispatch({
        type: PROJECT_ACTION_TYPES.SET_SAMPLE,
        payload: {id, title, path, settings},
      });
    });
  };

  const setRecordedSample = (
    title: string,
    filePath: string,
    settings: SampleSettings,
  ) => {
    // const addSample = (data: any) => {
    //   actions.setSample(data.key, data.key, {
    //     volume: data.volume,
    //     pan: data.pan,
    //     reverb: data.reverb,
    //   });
    // };
    // console.log(filePath);
    // SamplerModule.addSample(title, filePath, settings, addSample);
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

      // SamplerModule.addSample(
      //   newKey,
      //   path + `/${newKey}.wav`,
      //   intitialSampleSettings,
      //   () => {},
      // );

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

  const updateSample = (id: string, data: Partial<SampleSettings>) => {
    const samples = state.samples.map((sample: Sample) => {
      if (sample.id === id) {
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
    CounterModule.setBpm(bpm);
    dispatch({type: PROJECT_ACTION_TYPES.SET_BPM, payload: bpm});
  };

  const setPatternLength = (length: number) => {
    CounterModule.setPatternLength(length);
    dispatch({type: PROJECT_ACTION_TYPES.SET_PATTERN_LENGTH, payload: length});
  };

  const setPatterns = (patterns: Record<string, Pattern>) => {
    dispatch({type: PROJECT_ACTION_TYPES.UPDATE_PATTERNS, payload: patterns});
  };

  const resetState = () => {
    dispatch({type: PROJECT_ACTION_TYPES.RESET_STATE});
  };

  const setProject = (project: Project) => {
    project.samples.forEach(sample => {
      setSample(sample.id, sample.name, sample.path);
    });

    dispatch({type: PROJECT_ACTION_TYPES.SET_PROJECT, payload: project});
  };

  const actions = {
    setPlayerStatus,
    updatePattern,
    setPatterns,
    setSample,
    setRecordedSample,
    setProject,
    updateSample,
    replaceSample,
    removeSample,
    setBpm,
    setPatternLength,
    resetState,
  } as any;

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
