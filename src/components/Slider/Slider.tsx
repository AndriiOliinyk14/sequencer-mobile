import {GestureResponderEvent, StyleSheet, Text, View} from 'react-native';
import React, {FC, useState} from 'react';
import {useTheme} from '@react-navigation/native';
import uuid from 'react-native-uuid';

interface SliderInterface {
  value: number;
  onChange: (value: number) => void;
}

const Slider: FC<SliderInterface> = ({value, onChange}) => {
  const {colors} = useTheme();

  const [step, setStep] = useState(1);

  const [sliderDimensions, setSliderDimensions] = useState<{
    bottom: number;
    height: number;
    top: number;
  }>({bottom: 0, height: 0, top: 0});

  const handleSetPositionY = (locationY: number) => {
    const height = sliderDimensions.height;

    const heightOnePercent = height / 100;

    if (locationY <= height && locationY >= 0) {
      const result = 100 - locationY / heightOnePercent;
      const roundedResult = Math.round(result);

      if (roundedResult >= 100) {
        onChange(100);
      }
      if (roundedResult <= 0) {
        onChange(0);
      }

      if (Math.abs(roundedResult - value) >= step) {
        onChange(roundedResult);
      }
    }
  };

  const handleOnTouchStart = (e: GestureResponderEvent) => {
    handleSetPositionY(e.nativeEvent.locationY);
  };
  const handleOnTouchMove = (e: GestureResponderEvent) => {
    handleSetPositionY(e.nativeEvent.locationY);
  };

  const railPositionY = ((sliderDimensions.bottom - 4) / 100) * value;

  const stepsCount = 10;

  return (
    <View style={styles.container}>
      <View style={[styles.sliderContainer]}>
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
            styles.rail,
            {
              bottom: railPositionY,
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
          style={[styles.slider, {borderColor: colors.primary}]}
          onLayout={evt => {
            const {height, y} = evt.nativeEvent.layout;
            setSliderDimensions({
              height: height,
              top: y,
              bottom: y + height,
            });
          }}
          onTouchStart={handleOnTouchStart}
          onTouchMove={handleOnTouchMove}
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
  rail: {
    position: 'absolute',
    left: -10,
    marginBottom: -4,
    width: 30,
    height: 10,
    zIndex: 1,
    borderWidth: 1,
  },
  slider: {
    height: '100%',
    width: 10,
    borderWidth: 1,
  },
  sliderFill: {
    bottom: 0,
    position: 'absolute',
    height: '100%',
    width: 10,
  },

  stepsContainer: {
    position: 'absolute',
    right: -10,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  step: {
    // zIndex: 199,
  },
  stepIndicator: {
    width: 10,
    height: 1,
    backgroundColor: 'green',
  },
});
