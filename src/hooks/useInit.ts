import {useEffect} from 'react';

import {counterModule} from '../NativeModules';
import {useProjectContext} from '../context';

function useInit() {
  const {state} = useProjectContext();
  const {bpm, patternLength} = state;

  useEffect(() => {
    counterModule.setPatternLength(patternLength);
    counterModule.setBpm(bpm);
  }, [bpm, patternLength]);
}

export {useInit};
