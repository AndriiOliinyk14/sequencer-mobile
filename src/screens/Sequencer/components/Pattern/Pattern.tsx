import React, {FC} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {icons} from '../../../../components/icons';
import {useGlobalContext, useProjectContext} from '../../../../context';
import {DialogEnum} from '../../../../types';
import {Step} from './Step';

interface PatternProps {
  name: string;
  id: string;
  pattern: {isOn: boolean}[];
}

const Pattern: FC<PatternProps> = ({id, pattern}) => {
  const {
    actions: {openDialog},
  } = useGlobalContext();
  const {state, actions} = useProjectContext();
  const {patternLength} = state;
  const {updatePattern} = actions;

  const handleOnPress = (index: number, value: {isOn: boolean}) => {
    const newPattern = [...(state?.patterns?.[id] || [])];
    newPattern[index] = value;
    updatePattern(id, newPattern as any);
  };

  const icon =
    icons[id as keyof typeof icons] ||
    require('../../../../assets/icons/snare.png');

  const handleEditSample = () => {
    openDialog(DialogEnum.ADD_SAMPLE, {type: 'EDIT_SAMPLE', key: id});
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.instrument} onPress={handleEditSample}>
        <Image style={styles.instrumentImg} source={icon} />
      </TouchableOpacity>
      <View style={styles.steps}>
        {Array.from({length: patternLength}).map((_, index) => (
          <View
            style={[
              styles.stepsGroup,
              (index + 1) % 4 === 0 && styles.everyFourthStep,
            ]}
            key={`${id}_${index}`}>
            <Step
              isActive={pattern?.[index]?.isOn}
              onPress={() => {
                const value = !pattern?.[index]?.isOn;
                handleOnPress(index, {isOn: value});
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export {Pattern};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: 6,
    marginBottom: 10,
  },
  instrument: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instrumentImg: {
    width: 40,
    height: 30,
    objectFit: 'contain',
  },
  steps: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 2,
  },
  everyFourthStep: {
    paddingRight: 6,
  },
  stepsGroup: {
    flex: 1,
    width: '100%',
    height: 30,
  },
});
