import {createContext, ReactNode, useContext, useReducer} from 'react';
import {Alert} from 'react-native';
import RNBlobUtil from 'react-native-blob-util';
import uuid from 'react-native-uuid';
import {fsService, sampleStorageService} from '../../services';
import {SampleEntity, SamplesScreenTypeEnum} from '../../types';
import {SAMPLES_ACTION_TYPES} from './actionsTypes';
import {initialState} from './inititalState';
import reducer from './reducer';
import {ContextInterface} from './types';

const Context = createContext<ContextInterface>({
  state: initialState,
  actions: {
    setSample: () => {},
    importSample: () => {},
    removeSample: () => {},
    getAllSamples: () => {},
  },
});

const SamplesProvider = ({children}: {children: ReactNode}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setSample = () => {};

  const getAllSamples = async () => {
    try {
      const data = await sampleStorageService.getAll();
      dispatch({type: SAMPLES_ACTION_TYPES.SET_SAMPLES, payload: data});
    } catch (error) {
      console.error('SamplesProvider.getAllSamples: ', error);
    }
  };

  const importSample = async (
    name: string,
    format: string,
    uri: string,
    navigate: any,
  ) => {
    try {
      const id = uuid.v4();
      const base64Audio = await RNBlobUtil.fs.readFile(uri, 'base64');
      base64Audio.replace('base64Audio', '');

      const savedUri = await fsService.saveAudio({
        id,
        name,
        format,
        binaryData: base64Audio,
      });

      const sample = new SampleEntity(id, name, savedUri);

      await sampleStorageService.save(sample);

      await getAllSamples();
      navigate('Edit Sample', {id});
    } catch (error) {
      console.error('SamplesProvider.importSample: ', error);
    }
  };

  const removeSample = async (data: SampleEntity, callback: any) => {
    try {
      if (await fsService.removeAudio(data)) {
        if (await sampleStorageService.remove(data)) {
          await getAllSamples();
          callback();
          Alert.alert('Samples has been removed');
        }
      }
    } catch (error) {
      Alert.alert('Something went wrong');
      console.error('SamplesProvider.removeSample: ', error);
    }
  };

  const actions = {setSample, importSample, removeSample, getAllSamples};
  return (
    <Context.Provider value={{state, actions}}>{children}</Context.Provider>
  );
};

const useSamplesContext = () => useContext(Context);

export {SamplesProvider, useSamplesContext};
