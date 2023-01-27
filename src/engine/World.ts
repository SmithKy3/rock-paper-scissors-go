import { Entity } from '@/engine/Entity';

export class World {
  private currentFrameTime: number;
  private entities = new Array<Entity>();
  private lastFrameTime: number;
  private renderingContext?: CanvasRenderingContext2D;
  private renderLoopFrameKey: number | undefined;

  constructor() {
    const time = performance.now();
    this.currentFrameTime = time;
    this.lastFrameTime = time;
  }

  private drawFrame = (): void => {
    if (!this.renderingContext) {
      return;
    }
    this.lastFrameTime = this.currentFrameTime;
    const {
      canvas: { height: canvasHeight, width: canvasWidth },
    } = this.renderingContext;
    this.entities.forEach((entity) => {
      entity.checkForWallCollisions(canvasHeight, canvasWidth);
      entity.checkForEntityCollisions(this.entities);
    });
    this.renderingContext.clearRect(0, 0, canvasWidth, canvasHeight);
    this.renderingContext.save();
    this.renderingContext.translate(
      this.renderingContext.canvas.width / 2,
      this.renderingContext.canvas.height / 2
    );
    this.currentFrameTime = performance.now();
    const timeDelta = this.currentFrameTime - this.lastFrameTime;
    this.entities.forEach((entity) => {
      entity.draw(canvasHeight, canvasWidth, this.renderingContext!, timeDelta);
    });
    this.renderingContext.restore();
    window.requestAnimationFrame(this.drawFrame);
  };

  public addEntities(entities: Array<Entity>): void {
    this.entities.push(...entities);
  }

  public removeEntities(entityIds?: Array<string>): void {
    if (!entityIds) {
      this.entities = new Array<Entity>();
    } else {
      this.entities = this.entities.filter(
        (entity) => !entityIds.includes(entity.id)
      );
    }
  }

  public cancelRenderLoop(): void {
    if (this.renderLoopFrameKey) {
      window.cancelAnimationFrame(this.renderLoopFrameKey);
    }
    this.renderingContext = undefined;
  }

  public startRenderLoop(renderingContext: CanvasRenderingContext2D) {
    this.renderingContext = renderingContext;
    this.renderLoopFrameKey = window.requestAnimationFrame(this.drawFrame);
  }
}
