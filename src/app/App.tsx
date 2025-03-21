import {useTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {useListener} from '../hooks';
import {useInit} from '../hooks/useInit';
import EditSample from '../screens/EditSample/EditSample';
import Home from '../screens/Home';
import Mixer from '../screens/Mixer/Mixer';
import Record from '../screens/Record/Record';
import SamplesLibrary from '../screens/SamplesLibrary/SamplesLibrary';
import Sequencer from '../screens/Sequencer/Sequencer';
import Dialogs from './Dialogs';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  useListener();
  useInit();

  const {colors} = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Sequencer" component={Sequencer} />
        <Stack.Screen name="Samples Library" component={SamplesLibrary} />
        <Stack.Screen name="Edit Sample" component={EditSample} />
        <Stack.Screen name="Record" component={Record} />
        <Stack.Screen name="Mixer" component={Mixer} />
      </Stack.Navigator>
      <Dialogs />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    width: '100%',
    flex: 1,
  },
});

export default App;
