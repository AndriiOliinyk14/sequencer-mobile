import React, {useState} from 'react';
import {Dialog} from './Dialog';
import {Button, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {useGlobalContext} from '../../context/globalContext';
import {DialogEnum} from '../../types';

const list = [
  {key: 'kick', title: 'Kick'},
  {key: 'snare', title: 'Snare'},
  {key: 'clap', title: 'Clap'},
  {key: 'closed-hi-hat', title: 'Closed Hi-hat'},
  {key: 'open-hi-hat', title: 'Open Hi-hat'},
  {key: 'crash', title: 'Crash'},
];

const settings = {
  volume: 1,
  pan: 0,
  reverb: 0,
};

export const AddSampleDialog = () => {
  const {state, actions} = useGlobalContext();
  const [selectedSample, setSelectedSample] = useState<{
    key: string;
    title: string;
  } | null>(null);

  const handleAddSample = () => {
    if (selectedSample) {
      actions.setSample(selectedSample.key, selectedSample.title, settings);
      handleClose();
    }
  };

  const handleClose = () => {
    actions.closeDialog(DialogEnum.ADD_SAMPLE);
    setSelectedSample(null);
  };

  return (
    <Dialog isVisible={state.dialogs.ADD_SAMPLE.visible} onClose={handleClose}>
      <View style={styles.samples}>
        {list.map(item => {
          return (
            <TouchableHighlight
              key={item.key}
              style={[
                styles.sample,
                selectedSample?.key === item.key && styles.selectedSample,
              ]}
              onPress={() => setSelectedSample(item)}>
              <Text>{item.key}</Text>
            </TouchableHighlight>
          );
        })}
      </View>
      <Button
        disabled={!selectedSample}
        onPress={handleAddSample}
        title="Add sample"
      />
    </Dialog>
  );
};

const styles = StyleSheet.create({
  samples: {
    display: 'flex',
    gap: 4,
    paddingHorizontal: 40,
  },
  sample: {backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 4},
  selectedSample: {backgroundColor: 'blue'},
});
