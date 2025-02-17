import {useEffect} from 'react';
import {useGlobalContext} from '../context/globalContext';
import {SamplerModule} from '../NativeModules';
import {useCountContext} from '../context/countContext';

function usePlayer() {
  const {state} = useGlobalContext();
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
