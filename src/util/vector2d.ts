import { Vector2D } from '@/types/engine';

export const doAddition = (vecA: Vector2D, vecB: Vector2D): Vector2D => ({
  x: vecA.x + vecB.x,
  y: vecA.y + vecB.y,
});

export const doAdditionInPlace = (vecA: Vector2D, vecB: Vector2D): Vector2D => {
  vecA.x += vecB.x;
  vecA.y += vecB.y;
  return vecA;
};

export const doDotProduct = (vecA: Vector2D, vecB: Vector2D): number =>
  vecA.x * vecB.x + vecA.y * vecB.y;

export const doNegation = (vec: Vector2D): Vector2D => ({
  x: vec.x * -1,
  y: vec.y * -1,
});

export const doNegationInPlace = (vec: Vector2D): Vector2D => {
  vec.x *= -1;
  vec.y *= -1;
  return vec;
};

export const doReflectionInPlace = (
  vec: Vector2D,
  reflectionNormal: Vector2D
): Vector2D => {
  if (!isUnitVector(reflectionNormal)) {
    console.warn(
      'Reflection calculations from a non-unit vector may lead to unexpected behaviour.'
    );
  }
  const reflectionVec = getReflection(vec, reflectionNormal, false);
  vec.x = reflectionVec.x;
  vec.y = reflectionVec.y;
  return vec;
};

export const doScalarMultiplication = (
  vecA: Vector2D,
  scalar: number
): Vector2D => ({
  x: vecA.x * scalar,
  y: vecA.y * scalar,
});

export const doScalarMultiplicationInPlace = (
  vecA: Vector2D,
  scalar: number
): Vector2D => {
  vecA.x *= scalar;
  vecA.y *= scalar;
  return vecA;
};

export const doSubtraction = (vecA: Vector2D, vecB: Vector2D): Vector2D => ({
  x: vecA.x - vecB.x,
  y: vecA.y - vecB.y,
});

export const doSubtractionInPlace = (
  vecA: Vector2D,
  vecB: Vector2D
): Vector2D => {
  vecA.x -= vecB.x;
  vecA.y -= vecB.y;
  return vecA;
};

export const getReflection = (
  vec: Vector2D,
  reflectionNormal: Vector2D,
  warnOnBadNormal = true
): Vector2D => {
  if (warnOnBadNormal && !isUnitVector(reflectionNormal)) {
    console.warn(
      'Reflection calculations from a non-unit vector may lead to unexpected behaviour.'
    );
  }

  return doSubtraction(
    vec,
    doScalarMultiplication(
      reflectionNormal,
      2 * doDotProduct(vec, reflectionNormal)
    )
  );
};

export const isUnitVector = (vec: Vector2D): boolean =>
  (vec.x === 0 || Math.abs(vec.x) === 1) &&
  (vec.y === 0 || Math.abs(vec.y) === 1);
