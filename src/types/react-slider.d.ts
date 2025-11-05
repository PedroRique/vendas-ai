declare module 'react-slider' {
  import * as React from 'react';

  export interface ReactSliderProps {
    className?: string;
    thumbClassName?: string;
    trackClassName?: string;
    min?: number;
    max?: number;
    value?: number | number[];
    onChange?: (value: number | number[], index: number) => void;
    step?: number;
    ariaLabel?: string | string[];
    [key: string]: unknown;
  }

  const ReactSlider: React.FC<ReactSliderProps>;
  export default ReactSlider;
}

