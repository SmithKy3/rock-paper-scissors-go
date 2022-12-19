import { useEffect, FC } from 'react';

import { World } from '@/engine/World';
import { useCanvasContext } from '@/contexts/CanvasContext';

export interface CanvasRendererProps {
  world: World;
}

export const CanvasRenderer: FC<CanvasRendererProps> = ({ world }) => {
  const { canvasHeight, canvasWidth, getRenderingContext } = useCanvasContext();
  useEffect(() => {
    const renderingContext = getRenderingContext();

    if (renderingContext) {
      world.startRenderLoop(canvasHeight, canvasWidth, renderingContext);

      return () => {
        world.cancelRenderLoop();
      };
    }
  }, [canvasHeight, canvasWidth, getRenderingContext]);

  return null;
};
