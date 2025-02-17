import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {useCount} from '../hooks/useCount';
import {useInit} from '../hooks/useInit';
import {usePlayer} from '../hooks/usePlayer';
import {Home} from '../screens/Home';
import {Sequencer} from '../screens/Sequencer';
import Dialogs from './Dialogs';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  useCount();
  useInit();
  usePlayer();

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
            // options={{ headerShown: false }}
            name="Sequencer"
            options={({route}: any) => {
              return {title: route.params?.id};
            }}
            component={Sequencer}
          />
        </Stack.Navigator>
        <Dialogs />
      </NavigationContainer>
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
