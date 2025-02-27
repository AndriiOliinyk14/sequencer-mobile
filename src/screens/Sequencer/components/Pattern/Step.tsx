import {StyleSheet, TouchableHighlight, View} from 'react-native';
import React, {FC} from 'react';
import {useTheme} from '@react-navigation/native';

interface PatternProps {
  isActive: boolean;
  onPress: () => void;
}

const Step: FC<PatternProps> = ({isActive, onPress}) => {
  const {colors} = useTheme();
  return (
    <TouchableHighlight
      style={[
        styles.step,
        isActive
          ? {backgroundColor: colors.primary}
          : {backgroundColor: colors.border},
      ]}
      underlayColor={colors.primary}
      onPress={onPress}>
      <View style={[styles.step, isActive && styles.activeStep]} />
    </TouchableHighlight>
  );
};

export {Step};

const styles = StyleSheet.create({
  step: {
    flex: 1,
    borderRadius: 4,
    // backgroundColor: '#9B7EBD',
  },
  activeStep: {
    // backgroundColor: '#3B1E54',
  },
});
