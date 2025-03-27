import {useEffect} from 'react';

import {counterModule} from '../NativeModules';
import {useProjectContext, useSamplesContext} from '../context';

function useInit() {
  const {state} = useProjectContext();
  const {actions} = useSamplesContext();
  const {bpm, patternLength} = state;

  useEffect(() => {
    actions.getAllSamples();
  }, []);

  useEffect(() => {
    counterModule.setPatternLength(patternLength);
    counterModule.setBpm(bpm);
  }, [bpm, patternLength]);
}

export {useInit};
