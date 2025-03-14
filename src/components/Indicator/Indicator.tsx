import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useProjectContext} from '../../context';
import {useCountContext} from '../../context/countContext';

const Indicator = () => {
  const {count} = useCountContext();
  const {
    state: {patternLength},
  } = useProjectContext();

  return (
    <View style={styles.container}>
      <View style={styles.instrument}></View>
      <View style={styles.indicators}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
    gap: 6,
  },
  instrument: {
    width: 40,
    height: 20,
    // backgroundColor: 'red',
  },
  indicators: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
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
