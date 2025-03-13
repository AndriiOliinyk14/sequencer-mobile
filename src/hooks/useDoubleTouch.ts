import {useRef} from 'react';

const useDoubleTouch = () => {
  const timer = useRef<any>(null);

  const handleDoubleTouch = (cb: () => void) => {
    if (timer.current) {
      cb();
      timer.current = null;
      clearTimeout(timer.current);
    } else {
      clearTimeout(timer.current);

      timer.current = setTimeout(() => {
        timer.current = null;
      }, 1000);
    }
  };

  return {handleDoubleTouch};
};

export {useDoubleTouch};
