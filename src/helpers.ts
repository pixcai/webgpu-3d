import { vec3, mat4 } from 'gl-matrix';

export const createTransforms = (
  modelMat: mat4,
  translation: vec3 = [0, 0, 0],
  rotation: vec3 = [0, 0, 0],
  scaling: vec3 = [1, 1, 1],
) => {
  const rotateXMat = mat4.create();
  const rotateYMat = mat4.create();
  const rotateZMat = mat4.create();
  const translateMat = mat4.create();
  const scaleMat = mat4.create();

  mat4.fromTranslation(translateMat, translation);
  mat4.fromXRotation(rotateXMat, rotation[0]);
  mat4.fromYRotation(rotateYMat, rotation[1]);
  mat4.fromZRotation(rotateZMat, rotation[2]);
  mat4.fromScaling(scaleMat, scaling);

  mat4.mul(modelMat, rotateXMat, scaleMat);
  mat4.mul(modelMat, rotateYMat, modelMat);
  mat4.mul(modelMat, rotateZMat, modelMat);
  mat4.mul(modelMat, translateMat, modelMat);
};

export const createViewProjection = (
  aspect = 1.0,
  cameraPosition: vec3 = [2, 2, 4],
  center: vec3 = [0, 0, 0],
  up: vec3 = [0, 1, 0],
) => {
  const viewMat = mat4.create();
  const projectionMat = mat4.create();
  const viewProjectionMat = mat4.create();

  mat4.perspective(projectionMat, 2 * Math.PI / 5, aspect, 0.1, 100.0);
  mat4.lookAt(viewMat, cameraPosition, center, up);
  mat4.mul(viewProjectionMat, projectionMat, viewMat);

  return {
    viewMat,
    projectionMat,
    viewProjectionMat,
    cameraOptions: {
      eye: cameraPosition,
      center,
      zoomMax: 100,
      zoomSpeed: 2,
    },
  };
};