import React, {FC} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Card} from '../../../../components';
import {useProjectContext, useSamplesContext} from '../../../../context';
import {Step} from './Step';

interface PatternProps {
  name: string;
  id: string;
  pattern: {isOn: boolean}[];
  icon?: string;
}

const Pattern: FC<PatternProps> = ({id, pattern}) => {
  const {state: samples} = useSamplesContext();
  const {state, actions} = useProjectContext();
  const {patternLength} = state;
  const {updatePattern} = actions;
  const sample = samples.samplesObj[id];

  const handleOnPress = (index: number, value: {isOn: boolean}) => {
    const newPattern = [...(state?.patterns?.[id] || [])];
    newPattern[index] = value;
    updatePattern(id, newPattern as any);
  };

  return (
    <Card>
      <View style={styles.container}>
        <Image style={styles.instrumentIcon} source={sample.icon as any} />
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
    </Card>
  );
};

export {Pattern};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: 6,
  },
  instrument: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instrumentIcon: {
    width: 30,
    height: 30,
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
