import {StyleSheet, TouchableHighlight, View} from 'react-native';
import React, {FC} from 'react';

interface PatternProps {
  isActive: boolean;
  onPress: () => void;
}

const Step: FC<PatternProps> = ({isActive, onPress}) => {
  return (
    <TouchableHighlight
      style={[styles.step, isActive && styles.activeStep]}
      onPress={onPress}>
      <View style={[styles.step, isActive && styles.activeStep]} />
    </TouchableHighlight>
  );
};

export {Step};

const styles = StyleSheet.create({
  step: {
    flex: 1,
    backgroundColor: '#9B7EBD',
  },
  activeStep: {
    backgroundColor: '#3B1E54',
  },
});
