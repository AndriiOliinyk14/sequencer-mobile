import {useTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {useCount} from '../hooks/useCount';
import {useInit} from '../hooks/useInit';
import {usePlayer} from '../hooks/usePlayer';
import Home from '../screens/Home';
import SampleLibrary from '../screens/SampleLibrary/SampleLibrary';
import EditSample from '../screens/EditSample/EditSample';
import Sequencer from '../screens/Sequencer';
import Dialogs from './Dialogs';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  useCount();
  useInit();
  usePlayer();

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
        <Stack.Screen
          name="Sequencer"
          options={({route}: any) => {
            return {
              title: route.params?.id,
            };
          }}
          component={Sequencer}
        />
        <Stack.Screen name="Sample Library" component={SampleLibrary} />
        <Stack.Screen name="Edit Sample" component={EditSample} />
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
  content: {
    paddingTop: 40,
    flexDirection: 'column',
  },
});

export default App;
