import {useTheme} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {useGlobalContext, useProjectContext} from '../../context';
import {useCountContext} from '../../context/countContext';
import {CounterModule} from '../../NativeModules';
import {DialogEnum} from '../../types';
import {PlayerState} from '../../types/enums/PlayerStatus';

const Transport = () => {
  const {count} = useCountContext();
  const {
    actions: {openDialog},
  } = useGlobalContext();
  const {actions, state} = useProjectContext();
  const {colors} = useTheme();
  const {playerStatus, patternLength} = state;

  const isPlaying = playerStatus === PlayerState.PLAYING;
  const buttonTitle = isPlaying ? 'Stop' : 'Start';

  const handlePress = () => {
    const newState = isPlaying ? PlayerState.STOPPED : PlayerState.PLAYING;

    actions.setPlayerStatus(newState);
  };

  // const handleBpmChange = (value: number) => {
  //   actions.setBpm(value);
  //   CounterModule.setBpm(value);
  // };

  useEffect(() => {
    return () => {
      CounterModule.stop();
      actions.setPlayerStatus(PlayerState.STOPPED);
    };
  }, []);

  const handlePatternLengthChange = (value: number) => {
    actions.setPatternLength(value);
    CounterModule.setPatternLength(value);
  };

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
            {color: colors.text},
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
            {color: colors.text},
            patternLength === 32 && styles.patternLengthIsActive,
          ]}>
          32
        </Text>
      </TouchableNativeFeedback>
      <Button title="REC" onPress={() => openDialog(DialogEnum.RECORD)} />
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
  },
  patternLengthIsActive: {
    backgroundColor: 'red',
    color: 'white',
  },
});

export {Transport};
