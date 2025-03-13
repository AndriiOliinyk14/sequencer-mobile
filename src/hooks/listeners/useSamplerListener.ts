import {useEffect} from 'react';
import {useProjectContext} from '../../context';
import {samplerEmitter} from '../../NativeModules';
import {SamplerEvents} from '../../types';

const useSamplerListener = () => {
  const {actions} = useProjectContext();

  useEffect(() => {
    samplerEmitter.addListener(SamplerEvents.VolumeUpdate, ({id, value}) => {
      actions.updateSampleSettings(id, {volume: value});
    });

    samplerEmitter.addListener(SamplerEvents.PanUpdate, ({id, value}) => {
      actions.updateSampleSettings(id, {pan: value});
    });

    samplerEmitter.addListener(SamplerEvents.ReverbUpdate, ({id, value}) => {
      actions.updateSampleSettings(id, {reverb: value});
    });

    return () => {
      samplerEmitter.removeAllListeners(SamplerEvents.VolumeUpdate);
      samplerEmitter.removeAllListeners(SamplerEvents.PanUpdate);
      samplerEmitter.removeAllListeners(SamplerEvents.ReverbUpdate);
    };
  }, []);
};

export {useSamplerListener};
