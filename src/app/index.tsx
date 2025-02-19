import React from 'react';
import {CountProvider} from '../context/countContext';
import {ContextProvider} from '../context/globalContext';
import App from './App';
import {MainTheme} from '../theme/theme';
import {NavigationContainer} from '@react-navigation/native';

const RootApp = () => {
  return (
    <CountProvider>
      <ContextProvider>
        <NavigationContainer theme={MainTheme}>
          <App />
        </NavigationContainer>
      </ContextProvider>
    </CountProvider>
  );
};

export default RootApp;
