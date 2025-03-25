import React, {FC} from 'react';
import {StyleSheet, TouchableHighlight, View} from 'react-native';
import {useTheme} from '../../../../hooks';

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
        {borderColor: colors.primary},
        isActive ? {backgroundColor: colors.primary} : {},
      ]}
      underlayColor={colors.primary}
      onPress={onPress}>
      <></>
    </TouchableHighlight>
  );
};

export {Step};

const styles = StyleSheet.create({
  step: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
  },
});
