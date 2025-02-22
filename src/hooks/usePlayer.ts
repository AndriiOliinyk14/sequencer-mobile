import {useEffect} from 'react';
import {useProjectContext} from '../context';
import {useCountContext} from '../context/countContext';
import {SamplerModule} from '../NativeModules';

function usePlayer() {
  const {state} = useProjectContext();
  const {count} = useCountContext();
  const {patterns, samples} = state;

  useEffect(() => {
    samples?.forEach(sample => {
      if (patterns?.[sample.key]?.[count - 1]?.isOn) {
        SamplerModule.playSample(sample.key);
      }
    });
  }, [count]);
}

export {usePlayer};
