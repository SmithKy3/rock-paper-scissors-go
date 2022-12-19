import { getRandomInteger } from '@/util/number';
import { Entity } from '@/engine/Entity';

interface WorldCanvasData {
  canvasHeight: number;
  canvasWidth: number;
  renderingContext: CanvasRenderingContext2D;
}

const MAX_DIRECTIONAL_VELOCITY = 20;

const getRandomEntity = (): Entity =>
  new Entity(
    { x: 0, y: 0 },
    {
      x: getRandomInteger(
        -1 * MAX_DIRECTIONAL_VELOCITY,
        MAX_DIRECTIONAL_VELOCITY
      ),
      y: getRandomInteger(
        -1 * MAX_DIRECTIONAL_VELOCITY,
        MAX_DIRECTIONAL_VELOCITY
      ),
    }
  );

export class World {
  private canvasData: WorldCanvasData | undefined;
  private currentFrameTime: number;
  private entities: Array<Entity>;
  private lastFrameTime: number;
  private renderLoopFrameKey: number | undefined;

  constructor() {
    this.entities = Array.from({ length: 100 }).map(getRandomEntity);
    const time = performance.now();
    this.currentFrameTime = time;
    this.lastFrameTime = time;
  }

  private drawFrame = (): void => {
    if (!this.canvasData) {
      return;
    }
    this.lastFrameTime = this.currentFrameTime;
    const { canvasHeight, canvasWidth, renderingContext } = this.canvasData;
    this.entities.forEach((entity) => {
      entity.checkForWallCollisions(canvasHeight, canvasWidth);
      entity.checkForEntityCollisions(this.entities);
    });
    this.canvasData.renderingContext.clearRect(
      0,
      0,
      this.canvasData.canvasWidth,
      this.canvasData.canvasHeight
    );
    this.currentFrameTime = performance.now();
    const timeDelta = this.currentFrameTime - this.lastFrameTime;
    this.entities.forEach((entity) => {
      entity.draw(canvasHeight, canvasWidth, renderingContext, timeDelta);
    });
    window.requestAnimationFrame(this.drawFrame);
  };

  public cancelRenderLoop(): void {
    if (this.renderLoopFrameKey) {
      window.cancelAnimationFrame(this.renderLoopFrameKey);
    }
    this.canvasData = undefined;
  }

  public startRenderLoop(
    canvasHeight: number,
    canvasWidth: number,
    renderingContext: CanvasRenderingContext2D
  ) {
    this.canvasData = {
      canvasHeight,
      canvasWidth,
      renderingContext,
    };
    this.renderLoopFrameKey = window.requestAnimationFrame(this.drawFrame);
  }
}
