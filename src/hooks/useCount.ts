import {useEffect} from 'react';
import {useCountContext} from '../context/countContext';
import {counterEmitter, CounterModule} from '../NativeModules';

const COUNTER_LISTENER_TYPE = 'TimerUpdate';

function useCount() {
  const {setCount} = useCountContext();

  useEffect(() => {
    counterEmitter.addListener(COUNTER_LISTENER_TYPE, data => {
      setCount(data.count);
    });

    return () => {
      counterEmitter.removeAllListeners(COUNTER_LISTENER_TYPE);
      CounterModule.stop();
    };
  }, [setCount]);
}

export {useCount};
