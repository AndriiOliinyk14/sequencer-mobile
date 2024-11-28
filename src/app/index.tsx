import React from 'react';
import {CountProvider} from '../context/countContext';
import {ContextProvider} from '../context/globalContext';
import App from './App';

const RootApp = () => {
  return (
    <CountProvider>
      <ContextProvider>
        <App />
      </ContextProvider>
    </CountProvider>
  );
};

export default RootApp;
