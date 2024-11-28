import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useGlobalContext} from '../../context/globalContext';
import {Step} from './Step';

interface PatternProps {
  name: string;
  pattern: {isOn: boolean}[];
}

const Pattern: FC<PatternProps> = ({name, pattern}) => {
  const {state, actions} = useGlobalContext();
  const {patternLength} = state;
  const {updatePattern} = actions;

  console.log('name', name, pattern);

  const handleOnPress = (index: number, value: {isOn: boolean}) => {
    const newPattern = [...(state?.patterns[name] || [])];
    newPattern[index] = value;
    updatePattern(name, newPattern as any);
  };

  return (
    <View>
      <Text>Pattern: {name}</Text>

      <View style={styles.steps}>
        {Array.from({length: patternLength}).map((_, index) => (
          <View
            style={[
              styles.stepsGroup,
              (index + 1) % 4 === 0 && styles.everyFourthStep,
            ]}
            key={`${name}_${index}`}>
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
  steps: {
    paddingHorizontal: 10,
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
