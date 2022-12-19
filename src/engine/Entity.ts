import { nanoid } from 'nanoid';

import { Vector2D, WallType } from '@/types/engine';
import { getRandomInteger } from '@/util/number';
import {
  doAdditionInPlace,
  doNegationInPlace,
  doReflectionInPlace,
  doScalarMultiplication,
} from '@/util/vector2d';

export enum EntityType {
  Rock = 'ROCK',
  Paper = 'PAPER',
  Scissors = 'SCISSORS',
}

const entityTypeToEmoji: Record<EntityType, string> = {
  [EntityType.Rock]: '🪨',
  [EntityType.Paper]: '📝',
  [EntityType.Scissors]: '✂️',
};

const getRandomEntityType = (): EntityType =>
  (Object.values(EntityType) as Array<EntityType>)[getRandomInteger(0, 2)];

const velocityCoefficient = 0.01;

const wallTypeToNormal: Record<WallType, Vector2D> = {
  [WallType.Bottom]: { x: 0, y: 1 },
  [WallType.Left]: { x: 1, y: 0 },
  [WallType.Right]: { x: -1, y: 0 },
  [WallType.Top]: { x: 0, y: -1 },
};

export class Entity {
  private id: string;
  private framesUntilCanCollide = 300;
  private type: EntityType;
  public radius = 12;

  constructor(
    public center: Vector2D,
    public velocity: Vector2D,
    initialType?: EntityType
  ) {
    this.id = nanoid();
    this.type = initialType || getRandomEntityType();
  }

  private handleCollisionWithEntity(collisionEntityType: EntityType): void {
    this.velocity = doNegationInPlace(this.velocity);
    switch (collisionEntityType) {
      case EntityType.Rock:
        this.type =
          this.type === EntityType.Paper ? this.type : collisionEntityType;
        break;
      case EntityType.Paper:
        this.type =
          this.type === EntityType.Scissors ? this.type : collisionEntityType;
        break;
      default:
        this.type =
          this.type === EntityType.Rock ? this.type : collisionEntityType;
    }
  }

  private handleCollisionWithWall(collisionWallType: WallType): void {
    const wallNormal = wallTypeToNormal[collisionWallType];
    doReflectionInPlace(this.velocity, wallNormal);
  }

  private checkForEntityCollision(otherEntity: Entity): boolean {
    return (
      Math.hypot(
        this.center.x - otherEntity.center.x,
        this.center.y - otherEntity.center.y
      ) <=
      this.radius + otherEntity.radius
    );
  }

  public checkForEntityCollisions(allEntities: Array<Entity>): void {
    allEntities.forEach((entity) => {
      if (entity.id === this.id) {
        return;
      }

      if (
        this.framesUntilCanCollide === 0 &&
        this.checkForEntityCollision(entity)
      ) {
        this.framesUntilCanCollide = 60;
        this.handleCollisionWithEntity(entity.type);
      }
    });
  }

  public checkForWallCollisions(
    canvasHeight: number,
    canvasWidth: number
  ): void {
    const bottom = canvasHeight * -0.5;
    if (bottom >= this.center.y - this.radius) {
      return this.handleCollisionWithWall(WallType.Bottom);
    }
    const left = canvasWidth * -0.5;
    if (left >= this.center.x - this.radius) {
      return this.handleCollisionWithWall(WallType.Left);
    }
    const right = left * -1;
    if (right <= this.center.x + this.radius) {
      return this.handleCollisionWithWall(WallType.Right);
    }
    const top = bottom * -1;
    if (top <= this.center.y + this.radius) {
      return this.handleCollisionWithWall(WallType.Top);
    }
  }

  public draw(
    canvasHeight: number,
    canvasWidth: number,
    renderingContext: CanvasRenderingContext2D,
    timeDelta: number
  ): void {
    // Translate the entity using it's velocity and the time that has passed
    // since the last frame was rendered.
    doAdditionInPlace(
      this.center,
      doScalarMultiplication(this.velocity, timeDelta * velocityCoefficient)
    );
    // The standard HTML5 canvas has it's origin set to the top-left corner.
    // We treat everything as if the origin is in the centre. Something like
    // standard graph paper. We need to account for this when drawing entities
    // on the canvas.
    const wonkyCentre = doAdditionInPlace(
      {
        x: canvasWidth / 2,
        y: canvasHeight / 2,
      },
      this.center
    );

    renderingContext.font = `${this.radius * 2}px serif`;
    renderingContext.textAlign = 'center';
    renderingContext.textBaseline = 'middle';
    renderingContext.globalAlpha = this.framesUntilCanCollide > 0 ? 0.5 : 1;
    renderingContext.fillText(
      entityTypeToEmoji[this.type],
      wonkyCentre.x,
      wonkyCentre.y,
      this.radius * 2
    );
    if (this.framesUntilCanCollide > 0) {
      this.framesUntilCanCollide -= 1;
    }
  }
}
