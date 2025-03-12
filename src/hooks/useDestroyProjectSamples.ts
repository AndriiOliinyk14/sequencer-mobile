import {useEffect, useRef} from 'react';
import {useCountContext, useProjectContext} from '../context';
import {CounterModule, SamplerModule} from '../NativeModules';
import {PlayerState} from '../types';

const useDestroyProjectSamples = () => {
  const {state, actions} = useProjectContext();
  const {setCount} = useCountContext();

  const sampleIdsRef = useRef(state.sampleIds);

  useEffect(() => {
    sampleIdsRef.current = state.sampleIds;
  }, [state.sampleIds]);

  useEffect(() => {
    return () => {
      sampleIdsRef.current.forEach(id => {
        SamplerModule.destroySample(id);
      });
      actions.resetState();
      setCount(0);
      actions.setPlayerStatus(PlayerState.STOPPED);
      CounterModule.stop();
    };
  }, []);
};

export {useDestroyProjectSamples};
