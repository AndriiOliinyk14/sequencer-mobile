import {useCountListener} from './useCountListener';
import {useSamplerListener} from './useSamplerListener';

const useListener = () => {
  useCountListener();
  useSamplerListener();
};

export {useListener};
