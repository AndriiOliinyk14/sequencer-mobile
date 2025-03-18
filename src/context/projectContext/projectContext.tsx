import React, {createContext, useContext, useReducer} from 'react';
import {counterModule, samplerModule} from '../../NativeModules';

import {DEFAULT_SAMPLE_SETTINGS} from '../../const';
import {fsService} from '../../services';
import {Pattern, PlayerState, Project, SampleSettings} from '../../types';
import {PROJECT_ACTION_TYPES} from './actionTypes';
import {initialState} from './initialState';
import reducer from './reducer';
import {ContextInterface} from './types';

const Context = createContext<ContextInterface>({
  state: initialState,
  actions: {
    setPlayerStatus: () => {},
    updatePattern: () => {},
    setPatterns: () => {},
    setSample: () => {},
    setRecordedSample: () => {},
    updateSampleSettings: () => {},
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
      counterModule.start();
    } else {
      counterModule.stop();
    }

    dispatch({type: PROJECT_ACTION_TYPES.SET_PLAYER_STATUS, payload: status});
  };

  const updatePattern = (key: string, pattern: Pattern) => {
    dispatch({
      type: PROJECT_ACTION_TYPES.UPDATE_PATTERNS,
      payload: {...state.patterns, [key]: pattern},
    });
  };

  const setSample = async (
    id: string,
    name: string,
    path: string,
    settings: SampleSettings,
  ) => {
    const absolutePath = `${fsService.SamplesDirectoryPath}/${path}`;

    if (state.sampleIds.some((itemId: any) => itemId === id)) {
      return;
    }

    const response = await samplerModule.addSample(id, absolutePath, settings);

    if (response?.id) {
      dispatch({
        type: PROJECT_ACTION_TYPES.SET_SAMPLE,
        payload: {id, name, path, settings},
      });
    }
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

  const updateSampleSettings = (id: string, data: Record<string, number>) => {
    dispatch({
      type: PROJECT_ACTION_TYPES.UPDATE_SAMPLE,
      payload: {id, settings: data},
    });
  };

  const setBpm = (bpm: number) => {
    counterModule.setBpm(bpm);
    dispatch({type: PROJECT_ACTION_TYPES.SET_BPM, payload: bpm});
  };

  const setPatternLength = (length: number) => {
    counterModule.setPatternLength(length);
    dispatch({type: PROJECT_ACTION_TYPES.SET_PATTERN_LENGTH, payload: length});
  };

  const setPatterns = (patterns: Record<string, Pattern>) => {
    dispatch({type: PROJECT_ACTION_TYPES.UPDATE_PATTERNS, payload: patterns});
  };

  const resetState = () => {
    dispatch({type: PROJECT_ACTION_TYPES.RESET_STATE});
  };

  const setProject = (project: Project) => {
    project.sampleIds.forEach((id: string) => {
      const sample = project.samples[id];

      setSample(
        sample.id,
        sample.name,
        sample.path,
        sample?.settings ?? DEFAULT_SAMPLE_SETTINGS,
      );
    });

    dispatch({type: PROJECT_ACTION_TYPES.SET_PROJECT, payload: project});
  };

  const actions = {
    setPlayerStatus,
    updatePattern,
    setPatterns,
    setSample,
    updateSampleSettings,
    setRecordedSample,
    setProject,
    replaceSample,
    removeSample,
    setBpm,
    setPatternLength,
    resetState,
  } as ContextInterface['actions'];

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
