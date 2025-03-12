import {useEffect} from 'react';
import {useProjectContext} from '../../context';
import {useCountContext} from '../../context/countContext';
import {
  counterEmitter,
  CounterModule,
  SamplerModule,
} from '../../NativeModules';
import {CountEvents} from '../../types';

function useCountListener() {
  const {setCount, count} = useCountContext();

  const {
    state: {sampleIds, patterns},
  } = useProjectContext();

  useEffect(() => {
    sampleIds?.forEach(id => {
      if (patterns?.[id]?.[count - 1]?.isOn) {
        SamplerModule.playSample(id);
      }
    });
  }, [count]);

  useEffect(() => {
    counterEmitter.addListener(CountEvents.TimerUpdate, data => {
      setCount(data.count);
    });
  }, [setCount]);

  useEffect(() => {
    return () => {
      counterEmitter.removeAllListeners(CountEvents.TimerUpdate);
      CounterModule.stop();
    };
  }, []);
}

export {useCountListener};
