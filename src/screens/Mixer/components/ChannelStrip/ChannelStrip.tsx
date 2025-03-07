import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Slider} from '../../../../components';
import {Sample} from '../../../../types';
import {useTheme} from '@react-navigation/native';
import {samplerEmitter, SamplerModule} from '../../../../NativeModules';

interface ChannelStripInterface {
  data: Sample;
}

enum SamplerEvents {
  VolumeUpdate = 'VolumeUpdate',
}

const ChannelStrip: FC<ChannelStripInterface> = ({data}) => {
  const [volume, setVolume] = useState(data.settings.volume);
  const {colors} = useTheme();

  useEffect(() => {
    samplerEmitter.addListener(SamplerEvents.VolumeUpdate, ({id, value}) => {
      //add ID to this because we are controlling all fader like one
      if (id === data.id) {
        setVolume(value);
      }
    });

    return () => {
      samplerEmitter.removeAllListeners(SamplerEvents.VolumeUpdate);
    };
  }, []);

  const handleOnVolumeChange = (value: number) => {
    const volume = value / 100;
    console.log(data.id, volume);
    // setVolume(volume);
    SamplerModule.setSampleVolume(data.id, volume);
  };

  return (
    <View style={[styles.container, {borderColor: colors.border}]}>
      <Text numberOfLines={1} style={[styles.name, {color: colors.primary}]}>
        {data.name}
      </Text>
      <Slider value={volume * 100} onChange={handleOnVolumeChange} />
    </View>
  );
};

export default ChannelStrip;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    paddingHorizontal: 20,
    width: 100,
    gap: 12,
  },
  name: {
    fontSize: 10,
  },
});
