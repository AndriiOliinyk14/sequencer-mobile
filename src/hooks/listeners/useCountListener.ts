import {useEffect} from 'react';
import {InteractionManager} from 'react-native';
import {useProjectContext} from '../../context';
import {useCountContext} from '../../context/countContext';
import {
  counterEmitter,
  CounterModule,
  SamplerModule,
} from '../../NativeModules';

const COUNTER_LISTENER_TYPE = 'TimerUpdate';

const playSample = (id: string) => {
  InteractionManager.runAfterInteractions(() => {
    SamplerModule.playSample(id);
  });
};

function useCountListener() {
  const {setCount} = useCountContext();

  const {
    state: {sampleIds, patterns},
  } = useProjectContext();

  useEffect(() => {
    counterEmitter.addListener(COUNTER_LISTENER_TYPE, data => {
      setCount(data.count);

      sampleIds?.forEach(id => {
        if (patterns?.[id]?.[data.count - 1]?.isOn) {
          playSample(id);
        }
      });
    });
  }, [patterns, sampleIds, setCount]);

  useEffect(() => {
    return () => {
      counterEmitter.removeAllListeners(COUNTER_LISTENER_TYPE);
      CounterModule.stop();
    };
  }, []);
}

export {useCountListener};
