import { nanoid } from 'nanoid';

import { Vector2D, WallType } from '@/types/engine';
import { getRandomInteger } from '@/util/number';
import {
  doAdditionInPlace,
  doReflectionInPlace,
  doScalarMultiplication,
  getReflection,
  getUnitVector,
} from '@/util/vector2d';

export enum EntityType {
  Rock = 'ROCK',
  Paper = 'PAPER',
  Scissors = 'SCISSORS',
}

const entityTypeToEmoji: Record<EntityType, string> = {
  [EntityType.Rock]: String.fromCodePoint(0x1faa8),
  [EntityType.Paper]: String.fromCodePoint(0x1f4c3),
  [EntityType.Scissors]: String.fromCodePoint(0x2702),
};

const wallTypeToNormal: Record<WallType, Vector2D> = {
  [WallType.Bottom]: { x: 0, y: 1 },
  [WallType.Left]: { x: 1, y: 0 },
  [WallType.Right]: { x: -1, y: 0 },
  [WallType.Top]: { x: 0, y: -1 },
};

// Computers are fast. We can either work with extremely small numbers
// when describing velocity of entities or we can use some coeffecient
// (like below) to "slow down" an entity when calculating position changes.
const VELOCITY_COEFFICIENT = 0.01;

const getRandomEntityType = (): EntityType =>
  (Object.values(EntityType) as Array<EntityType>)[getRandomInteger(0, 2)];

export const getRandomEntity = (): Entity =>
  new Entity(
    {
      x: getRandomInteger(-50, 50),
      y: getRandomInteger(-50, 50),
    },
    {
      x: getRandomInteger(-20, 20),
      y: getRandomInteger(-20, 20),
    }
  );

export class Entity {
  private center: Vector2D;
  private framesUntilCanCollide = 300;
  private type: EntityType;
  private velocity: Vector2D;

  public id: string;
  public radius = 12;

  constructor(
    initialCenter: Vector2D,
    initialVelocity: Vector2D,
    initialType?: EntityType
  ) {
    this.center = initialCenter;
    this.id = nanoid();
    this.type = initialType || getRandomEntityType();
    this.velocity = initialVelocity;
  }

  private handleCollisionWithEntity(collisionEntity: Entity): void {
    let thisEntityWins: boolean;
    switch (collisionEntity.type) {
      case EntityType.Rock:
        thisEntityWins = this.type === EntityType.Paper;
        break;
      case EntityType.Paper:
        thisEntityWins = this.type === EntityType.Scissors;
        break;
      default:
        thisEntityWins = this.type === EntityType.Rock;
    }
    if (thisEntityWins) {
      collisionEntity.type = this.type;
    } else {
      this.type = collisionEntity.type;
    }

    const thisNewVelocity = getReflection(
      this.velocity,
      getUnitVector(collisionEntity.velocity)
    );
    const collisionEntityNewVelocity = getReflection(
      collisionEntity.velocity,
      getUnitVector(this.velocity)
    );
    this.velocity = thisNewVelocity;
    collisionEntity.velocity = collisionEntityNewVelocity;
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
    allEntities.forEach((otherEntity) => {
      if (otherEntity.id === this.id) {
        return;
      }

      if (
        this.framesUntilCanCollide === 0 &&
        otherEntity.framesUntilCanCollide === 0 &&
        this.checkForEntityCollision(otherEntity)
      ) {
        this.framesUntilCanCollide = 60;
        otherEntity.framesUntilCanCollide = 60;
        this.handleCollisionWithEntity(otherEntity);
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
    if (
      Math.abs(this.center.x) > canvasWidth / 2 ||
      Math.abs(this.center.y) > canvasHeight / 2
    ) {
      // debugger;
    }
    // Translate the entity using it's velocity and the time that has passed
    // since the last frame was rendered.
    doAdditionInPlace(
      this.center,
      doScalarMultiplication(this.velocity, timeDelta * VELOCITY_COEFFICIENT)
    );

    renderingContext.font = `${this.radius * 2}px Noto Color Emoji`;
    renderingContext.textAlign = 'center';
    renderingContext.textBaseline = 'middle';
    renderingContext.globalAlpha = this.framesUntilCanCollide > 0 ? 0.5 : 1;
    renderingContext.fillText(
      entityTypeToEmoji[this.type],
      this.center.x,
      this.center.y,
      this.radius * 2
    );
    if (this.framesUntilCanCollide > 0) {
      this.framesUntilCanCollide -= 1;
    }
  }
}
