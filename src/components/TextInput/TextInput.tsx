import {useTheme} from '@react-navigation/native';
import React, {FC} from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
} from 'react-native';

const TextInput: FC<TextInputProps> = props => {
  const {colors} = useTheme();

  return (
    <RNTextInput
      {...props}
      style={[props.style, styles.input, {color: colors.primary}]}
      placeholderTextColor={'white'}
    />
  );
};

export {TextInput};

const styles = StyleSheet.create({
  input: {},
});
