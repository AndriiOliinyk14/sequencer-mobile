import Slider from '@react-native-community/slider';
import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {useGlobalContext} from '../../context/globalContext';
import {SamplerModule} from '../../NativeModules';
import {DialogEnum} from '../../types';
import {Dialog} from './Dialog';

const MixerDialog = () => {
  const {actions, state} = useGlobalContext();
  const {dialogs, samples} = state;

  const handleOnClose = () => {
    actions.closeDialog(DialogEnum.MIXER);
  };

  const handleSepVolumeChange = (name: string, value: number) => {
    const formatedValue = value.toFixed(2);
    SamplerModule.setSampleVolume(name, Number(formatedValue));
  };

  return (
    <Dialog
      isVisible={dialogs[DialogEnum.MIXER].visible}
      onClose={handleOnClose}>
      <Text>MixerDialog</Text>

      <ScrollView style={styles.sliders}>
        {samples.map(sample => (
          <>
            <Text>{sample.title}</Text>
            <Slider
              key={`${sample.key}_volume`}
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              vertical={true}
              step={0.01}
              minimumTrackTintColor="#ff3434"
              maximumTrackTintColor="#000000"
              onValueChange={value => handleSepVolumeChange(sample.key, value)}
            />
          </>
        ))}
      </ScrollView>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  sliders: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
  },
  slider: {
    // transform: [{rotate: '-90deg'}],
    // width: 200,
    // height: 40,
  },
});

export {MixerDialog};
