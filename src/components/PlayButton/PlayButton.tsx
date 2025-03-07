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
        {
          borderColor: disabled
            ? colors.disabled
            : isActive
            ? colors.red
            : colors.notification,
          backgroundColor: isPresed ? colors.text : 'transparent',
        },
      ]}
      disabled={disabled}
      onPressIn={handleOnPressIn}
      onPressOut={handleOnPressOut}>
      {isActive ? (
        <>
          <View
            style={[
              styles.rectangle,
              {
                backgroundColor: disabled
                  ? colors.disabled
                  : isActive
                  ? colors.red
                  : colors.notification,
              },
            ]}
          />
          {/* <View style={styles.pause}>
            <View
              style={[
                styles.pauseColumn,
                {backgroundColor: disabled ? colors.disabled : colors.primary},
              ]}
            />
            <View
              style={[
                styles.pauseColumn,
                {backgroundColor: disabled ? colors.disabled : colors.primary},
              ]}
            />
          </View> */}
        </>
      ) : (
        <Animated.View
          style={[
            styles.triangle,
            {
              borderLeftColor: disabled ? colors.disabled : colors.notification,
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
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 4,
  },
  triangle: {
    width: 0,
    height: 0,
    borderWidth: 10,
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
  pauseColumn: {
    width: 4,
    height: 20,
  },
  rectangle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 14,
    height: 14,
    marginVertical: 3,
  },
});
