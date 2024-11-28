import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useCountContext} from '../../context/countContext';
import {useGlobalContext} from '../../context/globalContext';

const Indicator = () => {
  const {count} = useCountContext();
  const {
    state: {patternLength},
  } = useGlobalContext();

  return (
    <View style={styles.container}>
      {Array.from({length: patternLength}).map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            count - 1 === index && styles.activeIndicator,
            (index + 1) % 4 === 0 && styles.everyFourthStep,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
    gap: 2,
  },
  indicator: {
    flex: 1,
    height: 20,
    borderWidth: 1,
    borderColor: '#9B7EBD',
  },
  activeIndicator: {
    borderWidth: 1,
    backgroundColor: '#3B1E54',
  },
  everyFourthStep: {
    marginRight: 6,
  },
});

export {Indicator};
