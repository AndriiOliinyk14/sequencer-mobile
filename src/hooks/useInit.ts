import {useEffect} from 'react';

import {counterModule} from '../NativeModules';
import {useGlobalContext} from '../context/globalContext';

function useInit() {
  const {state} = useGlobalContext();
  const {bpm, patternLength} = state;

  useEffect(() => {
    counterModule.setPatternLength(patternLength);
    counterModule.setBpm(bpm);
  }, []);
}

export {useInit};
