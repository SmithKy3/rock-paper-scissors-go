export type RendererCancelFn = () => void;

export type RendererFn = (
  canvasHeight: number,
  canvasWidth: number,
  renderingContext: CanvasRenderingContext2D
) => RendererCancelFn;
