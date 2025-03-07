import {useEffect} from 'react';
import {samplerEmitter} from '../../NativeModules';
import {SamplerEvents} from '../../types';
import {useProjectContext} from '../../context';

const useSamplerListener = () => {
  const {state, actions} = useProjectContext();
  useEffect(() => {
    samplerEmitter.addListener(
      SamplerEvents.VolumeUpdate,
      ({id, value}) => {
        console.log({id, value});
        actions.updateSampleSettings(id, {volume: value});

        //add ID to this because we are controlling all fader like one
        //   if (id === data.id) {
        // setVolume(value);
      },
      // });

      // return () => {
      //   samplerEmitter.removeAllListeners(SamplerEvents.VolumeUpdate);
      // };\
    );
  }, []);
};

export {useSamplerListener};
