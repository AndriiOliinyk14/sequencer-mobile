import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {useGlobalContext} from '../../context/globalContext';
import {DialogEnum} from '../../types';
import {icons} from '../icons';
import {Dialog} from './Dialog';

const list = [
  {key: 'kick', title: 'Kick', icon: icons.kick},
  {key: 'snare', title: 'Snare', icon: icons.snare},
  {key: 'claps', title: 'Claps', icon: icons.claps},
  {key: 'hi-hat', title: 'Closed Hi-hat', icon: icons['hi-hat']},
  {key: 'open-hi-hat', title: 'Open Hi-hat', icon: icons['open-hi-hat']},
  {key: 'crash', title: 'Crash', icon: icons.crash},
];

const settings = {
  volume: 1,
  pan: 0,
  reverb: 0,
};

export const AddEditSampleDialog = () => {
  const {state, actions} = useGlobalContext();
  const {colors} = useTheme();
  const [selectedSample, setSelectedSample] = useState<{
    key: string;
    title: string;
  } | null>(null);

  const samples = state.samples;
  const dialogData = state.dialogs.ADD_SAMPLE;

  const isNewSample = dialogData?.options?.type === 'ADD_SAMPLE';

  const handleAddSample = () => {
    if (selectedSample) {
      actions.setSample(selectedSample.key, selectedSample.title, settings);
      handleClose();
    }
  };

  const handleReplaceSample = () => {
    if (selectedSample) {
      actions.replaceSample(
        dialogData.options.key,
        selectedSample.key,
        selectedSample.title,
      );
      handleClose();
    }
  };

  const handleConfirmButton = () => {
    if (isNewSample) {
      handleAddSample();
    } else {
      handleReplaceSample();
    }
  };

  const handleRemoveSample = () => {
    actions.removeSample(dialogData?.options?.key);
    handleClose();
  };

  const handleClose = () => {
    actions.closeDialog(DialogEnum.ADD_SAMPLE);
    setSelectedSample(null);
  };

  const title = isNewSample ? 'Add sample' : 'Change sample';

  return (
    <Dialog isVisible={dialogData.visible} onClose={handleClose}>
      <View style={styles.samples}>
        {list.map(item => {
          const isUsedAlready = samples?.some(
            sample => sample.key === item.key,
          );
          return (
            <>
              {!isUsedAlready && (
                <TouchableHighlight
                  key={item.key}
                  disabled={isUsedAlready}
                  style={[
                    styles.sample,
                    selectedSample?.key === item.key && {
                      backgroundColor: colors.primary,
                    },
                    isUsedAlready && {backgroundColor: 'grey'},
                  ]}
                  onPress={() => setSelectedSample(item)}>
                  <View style={styles.instrument}>
                    <Image style={styles.instrumentImg} source={item.icon} />
                    <Text
                      style={[
                        {color: colors.text, fontWeight: 'bold'},
                        isUsedAlready && {color: colors.background},
                      ]}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableHighlight>
              )}
            </>
          );
        })}
      </View>
      <Button
        disabled={!selectedSample}
        onPress={handleConfirmButton}
        title={title}
      />
      <Button
        onPress={handleRemoveSample}
        color="red"
        title={'Remove Sample'}
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
  sample: {paddingHorizontal: 10, paddingVertical: 4},
  selectedSample: {backgroundColor: '#92ccff'},
  instrument: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  instrumentImg: {
    width: 40,
    height: 30,
    objectFit: 'contain',
  },
});
