import {useEffect} from 'react';
import {samplerEmitter} from '../../NativeModules';
import {SamplerEvents} from '../../types';
import {useProjectContext} from '../../context';

const useSamplerListener = () => {
  const {state, actions} = useProjectContext();

  useEffect(() => {
    samplerEmitter.addListener(SamplerEvents.VolumeUpdate, ({id, value}) => {
      actions.updateSampleSettings(id, {volume: value});
    });

    return () => {
      samplerEmitter.removeAllListeners(SamplerEvents.VolumeUpdate);
    };
  }, []);
};

export {useSamplerListener};
