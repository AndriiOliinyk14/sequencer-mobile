import {Link} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useGlobalContext, useProjectContext} from '../../context';
import {useCountContext} from '../../context/countContext';
import {useTheme} from '../../hooks';
import {DialogEnum} from '../../types';
import {PlayerState} from '../../types/enums/PlayerStatus';
import {PlayButton} from '../PlayButton';

const Transport = () => {
  const {
    actions: {openDialog},
  } = useGlobalContext();
  const {count} = useCountContext();
  const {actions, state} = useProjectContext();
  const {colors} = useTheme();
  const {playerStatus, patternLength} = state;

  const isPlaying = playerStatus === PlayerState.PLAYING;

  const handlePress = () => {
    const newState = isPlaying ? PlayerState.STOPPED : PlayerState.PLAYING;

    actions.setPlayerStatus(newState);
  };

  // const handleBpmChange = (value: number) => {
  //   actions.setBpm(value);
  // };

  // const handlePatternLengthChange = (value: number) => {
  //   actions.setPatternLength(value);
  // };

  const handleOpenProjectSettings = () => {
    actions.setPlayerStatus(PlayerState.STOPPED);
    openDialog(DialogEnum.PROJECT_SETTINGS);
  };

  return (
    <View style={styles.container}>
      <PlayButton isActive={isPlaying} onPress={handlePress} />
      <Text style={[styles.count, {color: colors.primary}]}>{count}</Text>

      <Icon
        name="gear"
        size={24}
        color={colors.primary}
        onPress={handleOpenProjectSettings}
      />

      <Link screen={'Mixer'}>
        <Icon name="sliders" size={24} color={colors.primary} />
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  content: {
    paddingTop: 40,
  },
  count: {
    width: 50,
    textAlign: 'left',
    padding: 10,
    paddingVertical: 8,
    fontSize: 20,
    fontWeight: 700,
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
