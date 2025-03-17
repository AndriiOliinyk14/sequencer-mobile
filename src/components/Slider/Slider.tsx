import {useTheme} from '@react-navigation/native';
import React, {FC, useState} from 'react';
import {GestureResponderEvent, StyleSheet, Text, View} from 'react-native';
import uuid from 'react-native-uuid';
import {useDoubleTouch, useThrottle} from '../../hooks';
interface SliderInterface {
  value: number;
  onChange: (value: number) => void;
  onDoubleTouch?: () => void;
  direction?: 'horizontal' | 'vertical';
}

const Slider: FC<SliderInterface> = ({
  value,
  onChange,
  onDoubleTouch,
  direction = 'horizontal',
}) => {
  const {colors} = useTheme();
  const {handleDoubleTouch} = useDoubleTouch();

  const [step, setStep] = useState(1);

  const [sliderDimensions, setSliderDimensions] = useState<{
    bottom: number;
    height: number;
    top: number;
  }>({bottom: 0, height: 0, top: 0});

  const onChangeHandler = useThrottle((newValue: number) => {
    onChange(newValue);
  }, 300);

  const handleSetPositionY = (locationY: number) => {
    const height = sliderDimensions.height;

    const heightOnePercent = height / 100;

    if (locationY <= height && locationY >= 0) {
      const result = 100 - locationY / heightOnePercent;
      const formatedResult = Number(result.toFixed(2));
      const roundedResult = Math.round(formatedResult);

      if (roundedResult >= 100) {
        onChangeHandler(100);
      }
      if (roundedResult <= 0) {
        onChangeHandler(0);
      }

      if (Math.abs(roundedResult - value) >= step) {
        onChangeHandler(roundedResult);
      }
    }
  };

  const handleOnTouchStart = (e: GestureResponderEvent) => {
    handleSetPositionY(e.nativeEvent.locationY);
  };
  const handleOnTouchMove = (e: GestureResponderEvent) => {
    handleSetPositionY(e.nativeEvent.locationY);
  };

  const handleOnDoubleTouch = () => {
    if (onDoubleTouch) {
      handleDoubleTouch(onDoubleTouch);
    }
  };

  const thumbPositionY = ((sliderDimensions.bottom - 4) / 100) * value;

  const stepsCount = 10;

  return (
    <View style={styles.container}>
      <View
        style={[styles.sliderContainer]}
        onTouchStart={handleOnTouchStart}
        onTouchMove={handleOnTouchMove}
        onTouchEnd={handleOnDoubleTouch}>
        <View style={styles.stepsContainer}>
          {Array(stepsCount)
            .fill(null)
            .map((_, i) => (
              <View key={uuid.v4()} style={[styles.step]}>
                <View
                  style={[styles.stepIndicator, {backgroundColor: colors.text}]}
                />
                <Text style={{color: colors.primary, fontSize: 8}}>
                  {100 - 10 * i}
                </Text>
              </View>
            ))}
        </View>
        <View
          style={[
            styles.thumb,
            {
              bottom: thumbPositionY,
              backgroundColor: colors.text,
              borderColor: colors.text,
            },
          ]}
        />
        <View
          style={[
            styles.sliderFill,
            {height: `${value}%`, backgroundColor: colors.text},
          ]}
        />
        <View
          style={[
            styles.slider,
            {borderColor: colors.primary, backgroundColor: colors.primary},
          ]}
          onLayout={evt => {
            const {height, y} = evt.nativeEvent.layout;
            setSliderDimensions({
              height: height,
              top: y,
              bottom: y + height,
            });
          }}
        />
      </View>
    </View>
  );
};

export {Slider};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
  },

  sliderContainer: {
    position: 'relative',
    height: 140,
    width: 20,
  },
  thumb: {
    position: 'absolute',
    left: -3,
    marginBottom: -4,
    width: 10,
    height: 10,
    zIndex: 1,
    borderWidth: 1,
    borderRadius: 100,
  },
  slider: {
    height: '100%',
    width: 4,
    borderWidth: 1,
  },
  sliderFill: {
    bottom: 0,
    position: 'absolute',
    height: '100%',
    width: 4,
    zIndex: 1,
  },

  stepsContainer: {
    position: 'absolute',
    right: -10,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  step: {},
  stepIndicator: {
    width: 10,
    height: 1,
    backgroundColor: 'green',
  },
});
