import {useTheme} from '@react-navigation/native';
import React, {FC, useRef, useState} from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';
import {MainThemeInterface} from '../../theme/theme';

interface PlayButtonInterface {
  isActive: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const PlayButton: FC<PlayButtonInterface> = ({isActive, onPress, disabled}) => {
  const [isPresed, setPresed] = useState(false);

  const {colors} = useTheme() as MainThemeInterface;
  const opacity = useRef(new Animated.Value(1)).current; // Persist opacity across renders

  const handleOnPressIn = () => setPresed(true);
  const handleOnPressOut = () => setPresed(false);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          borderColor: disabled ? colors.disabled : colors.success,
          backgroundColor: isPresed ? colors.text : 'transparent',
        },
      ]}
      disabled={disabled}
      onPressIn={handleOnPressIn}
      onPressOut={handleOnPressOut}>
      {isActive ? (
        <View
          style={[
            styles.rectangle,
            {
              backgroundColor: disabled ? colors.disabled : colors.success,
            },
          ]}
        />
      ) : (
        <Animated.View
          style={[
            styles.triangle,
            {
              borderLeftColor: disabled ? colors.disabled : colors.success,
              opacity: opacity,
            },
          ]}
        />
      )}
    </Pressable>
  );
};

export {PlayButton};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 4,
  },
  triangle: {
    width: 0,
    height: 0,
    borderWidth: 8,
    marginRight: -9,
    marginLeft: 3,
    borderStyle: 'solid',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
  },
  pause: {
    flexDirection: 'row',
    gap: 2,
  },
  rectangle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 10,
    height: 10,
    marginVertical: 3,
  },
});
