import {useEffect} from 'react';
import {useProjectContext} from '../context';
import {useCountContext} from '../context/countContext';
import {SamplerModule} from '../NativeModules';

function usePlayer() {
  const {state} = useProjectContext();
  const {count} = useCountContext();
  const {patterns, sampleIds} = state;

  useEffect(() => {
    sampleIds?.forEach(id => {
      if (patterns?.[id]?.[count - 1]?.isOn) {
        SamplerModule.playSample(id);
      }
    });
  }, [count]);
}

export {usePlayer};
