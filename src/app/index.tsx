import React from 'react';
import {
  CountProvider,
  GlobalContextProvider,
  ProjectContextProvider,
} from '../context';
import {} from '../context/globalContext';
import App from './App';
import {MainTheme} from '../theme/theme';
import {NavigationContainer} from '@react-navigation/native';

const RootApp = () => {
  return (
    <CountProvider>
      <GlobalContextProvider>
        <ProjectContextProvider>
          <NavigationContainer theme={MainTheme}>
            <App />
          </NavigationContainer>
        </ProjectContextProvider>
      </GlobalContextProvider>
    </CountProvider>
  );
};

export default RootApp;
