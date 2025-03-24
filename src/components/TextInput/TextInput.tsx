import React, {FC} from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  Text,
} from 'react-native';
import {useTheme} from '../../hooks';

interface TextInputProps extends RNTextInputProps {
  label?: string;
}

const TextInput: FC<TextInputProps> = props => {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.disabled}]}>
      {props?.label && (
        <Text style={[styles.label, {color: colors.text}]}>{props.label}</Text>
      )}
      <RNTextInput
        {...props}
        style={[props.style, styles.input, {color: colors.primary}]}
        placeholderTextColor={'white'}
      />
    </View>
  );
};

export {TextInput};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    borderRadius: 4,
    flexGrow: 1,
    minWidth: 60,
  },
  label: {
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 12,
    top: 4,
    left: 10,
  },
  input: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 4,
    backgroundColor: 'transparent',
  },
});
