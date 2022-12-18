import { useCallback, useRef, Fragment, FC, ReactNode } from 'react';

import { combineClassNames } from '@/util/components';
import { useClientDimensions } from '@/hooks/useClientDimensions';
import { CanvasContextProvider } from '@/contexts/CanvasContext';
import styles from './Canvas.module.scss';

export interface CanvasProps {
  children?: ReactNode;
  className?: string;
}

export const Canvas: FC<CanvasProps> = ({ children, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { clientHeight, clientWidth } = useClientDimensions(canvasRef);
  const getRenderingContext = useCallback(
    () => canvasRef.current?.getContext('2d') ?? null,
    []
  );

  return (
    <Fragment>
      <canvas
        ref={canvasRef}
        className={combineClassNames(className, styles.canvas)}
        height={clientHeight}
        width={clientWidth}
      />
      <CanvasContextProvider
        canvasHeight={clientHeight}
        canvasWidth={clientWidth}
        getRenderingContext={getRenderingContext}
      >
        {children}
      </CanvasContextProvider>
    </Fragment>
  );
};
