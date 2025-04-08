import React, {FC, memo} from 'react';
import {VerticalSlider} from './components/VerticalSlider';
import {HorizontalSlider} from './components/HorizontalSlider';

interface SliderInterface {
  value: number;
  onChange: (value: number) => void;
  onDoubleTouch?: () => void;
  direction?: 'horizontal' | 'vertical';
  steps?: {label: string}[];
}

const Slider: FC<SliderInterface> = memo(
  ({value, onChange, onDoubleTouch, steps, direction = 'vertical'}) => {
    return (
      <>
        {direction === 'vertical' && (
          <VerticalSlider
            value={value}
            onChange={onChange}
            onDoubleTouch={onDoubleTouch}
            steps={steps}
          />
        )}

        {direction === 'horizontal' && (
          <HorizontalSlider
            value={value}
            onChange={onChange}
            onDoubleTouch={onDoubleTouch}
            steps={steps}
          />
        )}
      </>
    );
  },
);

export {Slider};
