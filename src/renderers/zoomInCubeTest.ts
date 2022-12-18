import { RendererFn } from '@/types/renderer';

export const zoomInCubeTestRenderer: RendererFn = (
  canvasHeight: number,
  canvasWidth: number,
  context: CanvasRenderingContext2D
) => {
  let i = 100;
  let renderLoopCancelKey: number | undefined;

  const drawFrame = () => {
    const r = i / 10;
    const centerY = Math.floor(canvasHeight / 2);
    const startY = centerY - r;
    const centerX = Math.floor(canvasWidth / 2);
    const startX = centerX - r;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = 'darkslategray';
    context.fillRect(startX, startY, r * 2, r * 2);
    i += 1;
    renderLoopCancelKey = window.requestAnimationFrame(drawFrame);
  };
  drawFrame();

  return () => {
    if (renderLoopCancelKey) {
      window.cancelAnimationFrame(renderLoopCancelKey);
    }
  };
};
