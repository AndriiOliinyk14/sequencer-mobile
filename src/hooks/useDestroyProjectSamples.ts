import {useEffect, useRef} from 'react';
import {useProjectContext} from '../context';
import {SamplerModule} from '../NativeModules';

const useDestroyProjectSamples = () => {
  const {state} = useProjectContext();

  const sampleIdsRef = useRef(state.sampleIds);

  useEffect(() => {
    sampleIdsRef.current = state.sampleIds;
  }, [state.sampleIds]);

  useEffect(() => {
    return () => {
      sampleIdsRef.current.forEach(id => {
        SamplerModule.destroySample(id);
      });
    };
  }, []);
};

export {useDestroyProjectSamples};
