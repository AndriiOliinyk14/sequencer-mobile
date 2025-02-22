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
    <CountProvider>
      <GlobalContextProvider>
        <ProjectContextProvider>
          <SamplesProvider>
            <NavigationContainer theme={MainTheme}>
              <App />
            </NavigationContainer>
          </SamplesProvider>
        </ProjectContextProvider>
      </GlobalContextProvider>
    </CountProvider>
  );
};

export default RootApp;
