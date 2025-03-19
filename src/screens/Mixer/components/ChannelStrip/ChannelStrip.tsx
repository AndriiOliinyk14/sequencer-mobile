import {useTheme} from '@react-navigation/native';
import React, {FC, memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Slider} from '../../../../components';
import {samplerModule} from '../../../../NativeModules';
import {Sample} from '../../../../types';

interface ChannelStripInterface {
  data: Sample;
}

const ChannelStrip: FC<ChannelStripInterface> = memo(({data}) => {
  const {colors} = useTheme();

  const handleOnVolumeChange = (value: number) => {
    const volume = value / 100;
    samplerModule.setSampleVolume(data.id, volume);
  };

  const handleOnPanChange = (value: number) => {
    const pan = value / 50 - 1;
    samplerModule.setSamplePan(data.id, pan);
  };

  const handleOnReverbChange = (value: number) => {
    const reverb = value / 100;
    samplerModule.setSampleReverb(data.id, reverb);
  };

  return (
    <View style={[styles.container, {borderColor: colors.border}]}>
      <Text numberOfLines={1} style={[styles.name, {color: colors.primary}]}>
        {data.name}
      </Text>

      <Text numberOfLines={1} style={[styles.name, {color: colors.primary}]}>
        Reverb
      </Text>
      <Slider
        value={data.settings.reverb * 100}
        onChange={handleOnReverbChange}
        onDoubleTouch={() => handleOnReverbChange(0)}
      />
      <Text numberOfLines={1} style={[styles.name, {color: colors.primary}]}>
        Pan
      </Text>
      <Slider
        value={(data.settings.pan + 1) * 50}
        onChange={handleOnPanChange}
        onDoubleTouch={() => handleOnPanChange(50)}
      />
      <Text numberOfLines={1} style={[styles.name, {color: colors.primary}]}>
        Volume
      </Text>
      <Slider
        value={data.settings.volume * 100}
        onChange={handleOnVolumeChange}
        onDoubleTouch={() => handleOnVolumeChange(80)}
      />
    </View>
  );
});

export default ChannelStrip;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    paddingHorizontal: 20,
    width: 100,
    gap: 24,
  },
  name: {
    fontSize: 10,
  },
});
