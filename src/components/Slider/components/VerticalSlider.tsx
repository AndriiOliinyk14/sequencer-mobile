import React, {FC, useState} from 'react';
import {GestureResponderEvent, StyleSheet, Text, View} from 'react-native';
import {useDoubleTouch, useTheme} from '../../../hooks';
import uuid from 'react-native-uuid';

const STEP = 1;

const STEPS_DEFAULT = [
  {label: 100},
  {label: 80},
  {label: 60},
  {label: 40},
  {label: 20},
  {label: 0},
];

interface VerticalSliderInterface {
  value: number;
  onChange: (value: number) => void;
  onDoubleTouch?: () => void;
  steps?: {label: string}[];
}

const VerticalSlider: FC<VerticalSliderInterface> = ({
  value,
  onChange,
  onDoubleTouch,
  steps = STEPS_DEFAULT,
}) => {
  const {colors} = useTheme();

  const {handleDoubleTouch} = useDoubleTouch();
  const [sliderDimensions, setSliderDimensions] = useState<{
    bottom: number;
    height: number;
    top: number;
  }>({bottom: 0, height: 0, top: 0});

  const thumbPositionY = ((sliderDimensions.bottom - 4) / 100) * value;

  const handleChangePosition = (locationY: number) => {
    const height = sliderDimensions.height;

    const heightOnePercent = height / 100;

    if (locationY <= height && locationY >= 0) {
      const result = 100 - locationY / heightOnePercent;
      const formatedResult = Number(result.toFixed(2));
      const roundedResult = Math.round(formatedResult);

      if (roundedResult >= 100) {
        onChange(100);
      }
      if (roundedResult <= 0) {
        onChange(0);
      }

      if (Math.abs(roundedResult - value) >= STEP) {
        onChange(roundedResult);
      }
    }
  };

  const handleOnTouchEnd = (e: GestureResponderEvent) => {
    handleChangePosition(e.nativeEvent.locationY);

    if (onDoubleTouch) {
      handleDoubleTouch(onDoubleTouch);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.sliderContainer]} onTouchEnd={handleOnTouchEnd}>
        <View style={styles.stepsContainer}>
          {steps.map(step => {
            return (
              <View key={uuid.v4()} style={[styles.step]} pointerEvents="none">
                <View style={[{backgroundColor: colors.text}]} />
                <View
                  style={[styles.stepIndicator, {backgroundColor: colors.text}]}
                />
                <Text style={[styles.stepText, {color: colors.primary}]}>
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>
        <View
          pointerEvents="none"
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
          pointerEvents="none"
          style={[
            styles.sliderFill,
            {height: `${value}%`, backgroundColor: colors.text},
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.slider,
            {
              borderColor: colors.primary,
              backgroundColor: colors.primary,
            },
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

export {VerticalSlider};

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
  step: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepIndicator: {
    width: 20,
    height: 1,
  },
  stepText: {
    paddingTop: 2,
    fontSize: 8,
  },
});
