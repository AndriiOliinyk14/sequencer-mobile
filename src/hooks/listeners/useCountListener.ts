import {useEffect} from 'react';
import {useProjectContext} from '../../context';
import {useCountContext} from '../../context/countContext';
import {counterEmitter, samplerModule} from '../../NativeModules';
import {CountEvents} from '../../types';

function useCountListener() {
  const {setCount, count} = useCountContext();

  const {
    state: {sampleIds, patterns},
  } = useProjectContext();

  useEffect(() => {
    sampleIds?.forEach(id => {
      if (patterns?.[id]?.[count - 1]?.isOn) {
        samplerModule.playSample(id);
      }
    });
  }, [count]);

  useEffect(() => {
    const subscription = counterEmitter.addListener(
      CountEvents.TimerUpdate,
      data => {
        setCount(data.count);
      },
    );

    return () => {
      subscription.remove(); // Properly remove listener
    };
  }, []);
}

export {useCountListener};
