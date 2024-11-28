import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

const CountContext = createContext<{
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}>({
  count: 0,
  setCount: () => {},
});

const CountProvider = ({children}: {children: ReactNode}) => {
  const [count, setCount] = useState(0);

  return (
    <CountContext.Provider value={{count, setCount}}>
      {children}
    </CountContext.Provider>
  );
};

const useCountContext = () => useContext(CountContext);

export {CountProvider, useCountContext};
