import { Vector2D } from '@/types/engine';

export function doAddition(vecA: Vector2D, vecB: Vector2D): Vector2D {
  return {
    x: vecA.x + vecB.x,
    y: vecA.y + vecB.y,
  };
}

export function doAdditionInPlace(vecA: Vector2D, vecB: Vector2D): Vector2D {
  vecA.x += vecB.x;
  vecA.y += vecB.y;
  return vecA;
}

export function doDotProduct(vecA: Vector2D, vecB: Vector2D): number {
  return vecA.x * vecB.x + vecA.y * vecB.y;
}

export function doNegation(vec: Vector2D): Vector2D {
  return {
    x: vec.x * -1,
    y: vec.y * -1,
  };
}

export function doReflectionInPlace(
  vec: Vector2D,
  reflectionNormal: Vector2D
): Vector2D {
  if (!isUnitVector(reflectionNormal)) {
    console.warn(
      'Reflection calculations from a non-unit vector may lead to unexpected behaviour.'
    );
  }
  const reflectionVec = getReflection(vec, reflectionNormal, false);
  vec.x = reflectionVec.x;
  vec.y = reflectionVec.y;
  return vec;
}

export function doScalarMultiplication(
  vecA: Vector2D,
  scalar: number
): Vector2D {
  return {
    x: vecA.x * scalar,
    y: vecA.y * scalar,
  };
}

export function doScalarMultiplicationInPlace(
  vecA: Vector2D,
  scalar: number
): Vector2D {
  vecA.x *= scalar;
  vecA.y *= scalar;
  return vecA;
}

export function doSubtraction(vecA: Vector2D, vecB: Vector2D): Vector2D {
  return {
    x: vecA.x - vecB.x,
    y: vecA.y - vecB.y,
  };
}

export function doSubtractionInPlace(vecA: Vector2D, vecB: Vector2D): Vector2D {
  vecA.x -= vecB.x;
  vecA.y -= vecB.y;
  return vecA;
}

export function getMagnitude(vec: Vector2D) {
  return Math.sqrt(vec.x ** 2 + vec.y ** 2);
}

export function getReflection(
  vec: Vector2D,
  reflectionNormal: Vector2D,
  warnOnBadNormal = true
): Vector2D {
  if (warnOnBadNormal && !isUnitVector(reflectionNormal)) {
    console.warn(
      'Reflection calculations from a non-unit vector may lead to unexpected behaviour.'
    );
  }

  if (reflectionNormal.x === 0 && reflectionNormal.y === 0) {
    return vec;
  }

  return doSubtraction(
    vec,
    doScalarMultiplication(
      reflectionNormal,
      2 * doDotProduct(vec, reflectionNormal)
    )
  );
}

export function getUnitVector(vec: Vector2D) {
  const magnitude = getMagnitude(vec);
  if (magnitude === 0) {
    return {
      x: 0,
      y: 0,
    };
  }

  return doScalarMultiplication(vec, 1 / magnitude);
}

export function isUnitVector(vec: Vector2D): boolean {
  const checkPasses = Math.abs(vec.x) <= 1 && Math.abs(vec.y) <= 1;
  return checkPasses;
}
