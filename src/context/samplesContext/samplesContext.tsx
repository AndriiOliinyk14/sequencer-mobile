import {createContext, ReactNode, useContext, useReducer} from 'react';
import {Alert} from 'react-native';
import RNBlobUtil from 'react-native-blob-util';
import uuid from 'react-native-uuid';
import {fsService, sampleStorageService} from '../../services';
import {SampleEntity} from '../../types';
import {SAMPLES_ACTION_TYPES} from './actionsTypes';
import {initialState} from './inititalState';
import reducer from './reducer';
import {ContextInterface} from './types';

const Context = createContext<ContextInterface>({
  state: initialState,
  actions: {
    importSample: () => {},
    removeSample: () => {},
    updateSample: () => {},
    getAllSamples: () => {},
  },
});

const SamplesProvider = ({children}: {children: ReactNode}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getAllSamples = async () => {
    try {
      const data = await sampleStorageService.getAll();
      const dataObj = data?.reduce(
        (acc, item) => ({...acc, [item.id]: item}),
        {},
      );

      dispatch({
        type: SAMPLES_ACTION_TYPES.SET_SAMPLES,
        payload: {data, dataObj},
      });

      // await addAllSamples();
    } catch (error) {
      console.error('SamplesProvider.getAllSamples: ', error);
    }
  };

  const importSample = async (
    name: string,
    format: string,
    icon: string,
    uri: string,
    callback: any,
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

      const sample = new SampleEntity(id, name, savedUri, icon);

      await sampleStorageService.save(sample);

      await getAllSamples();
      callback(id);
    } catch (error) {
      console.error('SamplesProvider.importSample: ', error);
    }
  };

  const updateSample = async (id: string, name: string, uri: string) => {
    try {
      const base64Audio = await RNBlobUtil.fs.readFile(uri, 'base64');
      base64Audio.replace('base64Audio', '');

      const savedUri = await fsService.saveAudio({
        id,
        name,
        format: 'wav',
        binaryData: base64Audio,
      });

      const sample = new SampleEntity(id, name, savedUri);

      await sampleStorageService.save(sample);

      await getAllSamples();
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

  const actions = {
    importSample,
    removeSample,
    getAllSamples,
    updateSample,
  };
  return (
    <Context.Provider value={{state, actions}}>{children}</Context.Provider>
  );
};

const useSamplesContext = () => useContext(Context);

export {SamplesProvider, useSamplesContext};
