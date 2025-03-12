import {useRef} from 'react';

function useThrottle(callback: any, delay: number) {
  const lastCallRef = useRef(0);

  return (...args: any) => {
    const now = Date.now();

    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    }
  };
}

export {useThrottle};
