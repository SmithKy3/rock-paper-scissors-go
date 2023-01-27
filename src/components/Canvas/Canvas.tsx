import React from 'react';

import { combineClassNames } from '@/util/components';
import { useClientDimensions } from '@/hooks/useClientDimensions';

import styles from './Canvas.module.scss';

export interface CanvasProps {
  className?: string;
}

export const Canvas = React.forwardRef<HTMLCanvasElement, CanvasProps>(
  ({ className }, ref) => {
    const { clientHeight, clientWidth } = useClientDimensions(
      ref as React.RefObject<HTMLCanvasElement>
    );

    return (
      <canvas
        ref={ref}
        className={combineClassNames(className, styles.canvas)}
        height={clientHeight}
        width={clientWidth}
      />
    );
  }
);
