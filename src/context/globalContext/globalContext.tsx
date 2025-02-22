import React, {createContext, useContext, useReducer} from 'react';
import {GLOBAL_ACTION_TYPES} from './actionTypes';
import {initialState} from './initialState';
import reducer from './reducer';
import {ContextInterface} from './types';

export const Context = createContext<ContextInterface>({
  state: initialState,
  actions: {
    openDialog: () => {},
    closeDialog: () => {},
    resetState: () => {},
  },
});

export const GlobalContextProvider = ({children}: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const resetState = () => {
    dispatch({type: GLOBAL_ACTION_TYPES.RESET_STATE});
  };

  const openDialog = (name: string, data?: any) => {
    dispatch({
      type: GLOBAL_ACTION_TYPES.OPEN_DIALOG,
      payload: {name, options: data},
    });
  };

  const closeDialog = (name: string) => {
    dispatch({
      type: GLOBAL_ACTION_TYPES.CLOSE_DIALOG,
      payload: {name},
    });
  };

  const actions = {
    openDialog,
    closeDialog,
    resetState,
  };

  return (
    <Context.Provider
      value={{
        state,
        actions,
      }}>
      {children}
    </Context.Provider>
  );
};

export const useGlobalContext = () => useContext(Context);
