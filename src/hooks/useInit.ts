import {useEffect} from 'react';

import RNFS from 'react-native-fs';
import {CounterModule, SamplerModule} from '../NativeModules';
import {useGlobalContext} from '../context/globalContext';

// const initialSamples = ['kick', 'snare', 'hi-hat', 'hi-hat-open'];

function useInit() {
  const {actions, state} = useGlobalContext();
  const {bpm, patternLength} = state;

  useEffect(() => {
    const path = RNFS.MainBundlePath;

    CounterModule.setPatternLength(patternLength);
    CounterModule.setBpm(bpm);

    // const settings = {
    //   volume: 1,
    //   pan: 0,
    //   reverb: 0,
    // };

    // const addSample = (data: any) => {
    //   actions.setSample(data.key, data.key, {
    //     volume: data.volume,
    //     pan: data.pan,
    //     reverb: data.reverb,
    //   });
    // };

    // initialSamples.forEach(sample => {
    //   SamplerModule.addSample(
    //     sample,
    //     path + `/${sample}.wav`,
    //     settings,
    //     addSample,
    //   );
    // });
  }, []);
}

export {useInit};
