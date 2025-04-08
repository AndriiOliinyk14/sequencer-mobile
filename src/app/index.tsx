import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {
  CountProvider,
  GlobalContextProvider,
  ProjectContextProvider,
  SamplesProvider,
} from '../context';
import {MainTheme} from '../theme/theme';
import App from './App';

const RootApp = () => {
  return (
    <GlobalContextProvider>
      <CountProvider>
        <SamplesProvider>
          <ProjectContextProvider>
            <NavigationContainer theme={MainTheme}>
              <App />
            </NavigationContainer>
          </ProjectContextProvider>
        </SamplesProvider>
      </CountProvider>
    </GlobalContextProvider>
  );
};

export default RootApp;
