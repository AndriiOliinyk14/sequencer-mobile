import React, {FC, useEffect, useRef, useState} from 'react';
import {Animated, Easing, Pressable, StyleSheet} from 'react-native';
import {useTheme} from '../../hooks';

interface RecButtonInterface {
  isActive: boolean;
  onPress: () => void;
}

const RecButton: FC<RecButtonInterface> = ({isActive, onPress}) => {
  const [isPresed, setPresed] = useState(false);

  const {colors} = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;
  const animation = useRef<any>(null);

  useEffect(() => {
    if (isActive) {
      animation.current = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.4,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );

      animation.current.start();
    } else {
      animation.current?.stop();
      opacity.setValue(1);
    }

    return () => opacity.stopAnimation();
  }, [isActive]);

  const handleOnPressIn = () => setPresed(true);
  const handleOnPressOut = () => setPresed(false);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          borderColor: colors.error,
          backgroundColor: isPresed ? colors.warning : 'transparent',
        },
      ]}
      onPressIn={handleOnPressIn}
      onPressOut={handleOnPressOut}>
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: colors.error,
            borderColor: colors.error,
            opacity: opacity,
          },
        ]}
      />
    </Pressable>
  );
};

export {RecButton};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: '50%',
  },
});
