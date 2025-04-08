import React, {createContext, useContext, useReducer} from 'react';
import {counterModule, samplerModule} from '../../NativeModules';

import {DEFAULT_SAMPLE_SETTINGS} from '../../const';
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

const Context = createContext<ContextInterface>({
  state: initialState,
  actions: {
    setPlayerStatus: () => {},
    updatePattern: () => {},
    setPatterns: () => {},
    setSample: () => {},
    updateSampleSettings: () => {},
    removeSample: () => {},
    setBpm: () => {},
    setPatternLength: () => {},
    setProject: () => {},
    resetState: () => {},
    reloadSample: () => {},
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

  const loadSample = async (sample: Sample) => {
    const absolutePath = `${fsService.SamplesDirectoryPath}/${sample.path}`;
    return await samplerModule.addSample(
      sample.id,
      absolutePath,
      sample.settings,
    );
  };

  const setSample = async (
    id: string,
    name: string,
    path: string,
    icon: string | undefined,
    settings: SampleSettings,
  ) => {
    if (state.sampleIds.some((itemId: any) => itemId === id)) {
      return;
    }

    const response = await loadSample({id, name, path, icon, settings});

    if (response?.id) {
      dispatch({
        type: PROJECT_ACTION_TYPES.SET_SAMPLE,
        payload: {id, name, path, icon, settings},
      });
    }
  };

  const removeSample = async (sample: Sample) => {
    const patterns = {...state.patterns};
    delete patterns[sample.id];

    const sampleIds = state.sampleIds.filter((id: string) => id !== sample.id);

    const samples = {...state.samples};
    delete samples[sample.id];

    await samplerModule.destroySample(sample.id);

    dispatch({
      type: PROJECT_ACTION_TYPES.REMOVE_SAMPLE,
      payload: {patterns, sampleIds, samples},
    });
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

  const reloadSample = async (sample: Sample) => {
    await samplerModule.destroySample(sample.id);
    await loadSample(sample);
  };

  const setProject = (project: Project) => {
    project.sampleIds.forEach((id: string) => {
      const sample = project.samples[id];

      setSample(
        sample.id,
        sample.name,
        sample.path,
        sample.icon,
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
    setProject,
    removeSample,
    setBpm,
    setPatternLength,
    resetState,
    reloadSample,
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
