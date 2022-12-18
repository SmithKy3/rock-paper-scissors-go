import { useEffect, FC } from 'react';

import { RendererFn } from '@/types/renderer';
import { useCanvasContext } from '@/contexts/CanvasContext';

export interface CanvasRendererProps {
  renderer: RendererFn;
}

export const CanvasRenderer: FC<CanvasRendererProps> = ({ renderer }) => {
  const { canvasHeight, canvasWidth, getRenderingContext } = useCanvasContext();
  useEffect(() => {
    const context = getRenderingContext();

    if (context) {
      const rendererCancel = renderer(canvasHeight, canvasWidth, context);

      return () => {
        rendererCancel();
      };
    }
  }, [canvasHeight, canvasWidth, getRenderingContext]);

  return null;
};
