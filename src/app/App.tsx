import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Pattern, Transport} from '../components';
import {Indicator} from '../components/Indicator/Indicator';
import {useGlobalContext} from '../context/globalContext';
import {useCount} from '../hooks/useCount';
import {useInit} from '../hooks/useInit';
import {usePlayer} from '../hooks/usePlayer';
import Dialogs from './Dialogs';

function App(): React.JSX.Element {
  const {state} = useGlobalContext();
  const {patterns, samples} = state;

  console.log('samples', samples);
  console.log('patterns', patterns);

  useCount();
  useInit();
  usePlayer();

  return (
    <SafeAreaView style={styles.container}>
      <Dialogs />
      <View style={styles.content}>
        <Transport />
        <Indicator />
        {samples.map(sample => (
          <Pattern
            key={sample.key}
            name={sample.key}
            pattern={patterns[sample.key]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: '#ffffff',
    height: '100%',
    width: '100%',
    flex: 1,
  },
  content: {
    paddingTop: 40,
    flexDirection: 'column',
  },
});

export default App;
