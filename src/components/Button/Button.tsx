import {useTheme} from '@react-navigation/native';
import React, {FC, ReactNode} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {MainThemeInterface} from '../../theme/theme';

interface Button {
  children: ReactNode;
  color?: string;
  disabled?: boolean;
  onPress?: () => void;
}

const Button: FC<Button> = ({children, onPress, color, disabled}) => {
  const {colors} = useTheme() as MainThemeInterface;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: disabled ? colors.disabled : colors.card,
          borderColor: color ?? disabled ? colors.disabledText : colors.text,
        },
      ]}>
      {typeof children === 'string' ? (
        <Text
          style={{
            color: color ?? disabled ? colors.disabledText : colors.text,
          }}>
          {children}
        </Text>
      ) : (
        <>{children}</>
      )}
    </Pressable>
  );
};

export {Button};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
});
