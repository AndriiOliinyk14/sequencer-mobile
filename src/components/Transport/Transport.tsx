import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {useCountContext} from '../../context/countContext';
import {useGlobalContext} from '../../context/globalContext';
import {CounterModule} from '../../NativeModules';
import {PlayerState} from '../../types/PlayerStatus';
import {DialogEnum} from '../../types';

const Transport = () => {
  const {count} = useCountContext();
  const {actions, state} = useGlobalContext();
  const {playerStatus, patternLength} = state;

  const buttonTitle = playerStatus === PlayerState.PLAYING ? 'Stop' : 'Start';

  const handlePress = () => {
    const newState =
      state.playerStatus === PlayerState.PLAYING
        ? PlayerState.STOPPED
        : PlayerState.PLAYING;

    if (newState === PlayerState.PLAYING) {
      CounterModule.start();
    } else {
      CounterModule.stop();
    }

    actions.setPlayerStatus(newState);
  };

  // const handleBpmChange = (value: number) => {
  //   actions.setBpm(value);
  //   CounterModule.setBpm(value);
  // };

  const handlePatternLengthChange = (value: number) => {
    actions.setPatternLength(value);
    CounterModule.setPatternLength(value);
  };

  // const handleOnStopRecording = (name: string) => {
  //   SamplerModule.stopRecordingSample(name, data => {
  //     console.log('fileUrl', data);

  //     if (!data) {
  //       return;
  //     }

  //     console.log('addSample', (data as string).replace('file://', ''));

  //     SamplerModule.addSample(name, data, data => actions.setSamples(data));
  //   });
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <Button title={buttonTitle} onPress={handlePress} />
      <TouchableNativeFeedback
        disabled={patternLength === 16}
        onPress={() => handlePatternLengthChange(16)}>
        <Text
          style={[
            styles.patternLength,
            patternLength === 16 && styles.patternLengthIsActive,
          ]}>
          16
        </Text>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        disabled={patternLength === 32}
        onPress={() => handlePatternLengthChange(32)}>
        <Text
          style={[
            styles.patternLength,
            patternLength === 32 && styles.patternLengthIsActive,
          ]}>
          32
        </Text>
      </TouchableNativeFeedback>
      <Button
        title="Mixer"
        onPress={() => actions.openDialog(DialogEnum.MIXER)}
      />
      <Button
        title="REC"
        onPress={() => actions.openDialog(DialogEnum.RECORD)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  content: {
    paddingTop: 40,
  },
  count: {
    width: 50,
    textAlign: 'center',
    padding: 10,
    fontSize: 20,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
  },
  patternLength: {
    padding: 4,
    borderRadius: 4,
    color: 'black',
  },
  patternLengthIsActive: {
    backgroundColor: 'red',
    color: 'white',
  },
});

export {Transport};
