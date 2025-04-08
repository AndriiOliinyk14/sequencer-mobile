import React, {FC, useState} from 'react';
import {GestureResponderEvent, StyleSheet, Text, View} from 'react-native';
import uuid from 'react-native-uuid';
import {useDoubleTouch, useTheme} from '../../../hooks';

const STEP = 0.1;

const STEPS_DEFAULT = [
  {label: 0},
  {label: 25},
  {label: 50},
  {label: 75},
  {label: 100},
];

interface HorizontalSliderInterface {
  value: number;
  onChange: (value: number) => void;
  onDoubleTouch?: () => void;
  steps?: {label: string}[];
}

const HorizontalSlider: FC<HorizontalSliderInterface> = ({
  value,
  onChange,
  onDoubleTouch,
  steps = STEPS_DEFAULT,
}) => {
  const {colors} = useTheme();

  const {handleDoubleTouch} = useDoubleTouch();
  const [sliderDimensions, setSliderDimensions] = useState<{
    width: number;
    left: number;
    right: number;
  }>({width: 0, left: 0, right: 0});

  const thumbPositionX = ((sliderDimensions.right - 4) / 100) * value;

  const handleChangePosition = (locationX: number) => {
    const {width} = sliderDimensions;

    const widthOnePercent = width / 100;

    if (locationX <= width && locationX >= 0) {
      const result = locationX / widthOnePercent;
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
    handleChangePosition(e.nativeEvent.locationX);

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
              left: thumbPositionX,
              backgroundColor: colors.text,
              borderColor: colors.text,
            },
          ]}
        />
        <View
          pointerEvents="none"
          style={[
            styles.sliderFill,
            {width: `${value}%`, backgroundColor: colors.text},
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
            const {width, x} = evt.nativeEvent.layout;
            setSliderDimensions({
              width,
              left: x,
              right: x + width,
            });
          }}
        />
      </View>
    </View>
  );
};

export {HorizontalSlider};

const styles = StyleSheet.create({
  container: {},

  sliderContainer: {
    position: 'relative',
    height: 30,
    width: '100%',
  },
  thumb: {
    position: 'absolute',
    width: 10,
    height: 10,
    top: -2,
    marginLeft: -1,
    zIndex: 1,
    borderWidth: 1,
    borderRadius: 100,
  },
  slider: {
    height: 4,
    width: '100%',
  },
  sliderFill: {
    top: 0,
    left: 0,
    position: 'absolute',
    height: 4,
    width: '100%',
    zIndex: 1,
  },

  stepsContainer: {
    position: 'absolute',
    left: 0,
    top: -14,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 2,
  },
  step: {},
  stepText: {
    fontSize: 8,
  },
});
