import Renderer from './Renderer';
// @ts-ignore
import * as defaultShaderCode from './shaders/default.wgsl';
// @ts-ignore
import * as lightShaderCode from './shaders/light.wgsl';
// @ts-ignore
import * as textureShaderCode from './shaders/texture.wgsl';

export const enum ShaderLocation {
  COLOR = 0,
  TEXTURE = 0,
  VERTEX = 1,
  NORMAL = 2,
}

export const enum ShaderType {
  DEFAULT,
  LIGHT,
  TEXTURE,
}

const colorBufferLayout: GPUVertexBufferLayout = {
  arrayStride: 12,
  attributes: [
    {
      format: 'float32x3',
      offset: 0,
      shaderLocation: ShaderLocation.COLOR,
    },
  ],
};

const vertexBufferLayout: GPUVertexBufferLayout = {
  arrayStride: 12,
  attributes: [
    {
      format: 'float32x3',
      offset: 0,
      shaderLocation: ShaderLocation.VERTEX,
    },
  ],
};

const normalBufferLayout: GPUVertexBufferLayout = {
  arrayStride: 12,
  attributes: [
    {
      format: 'float32x3',
      offset: 0,
      shaderLocation: ShaderLocation.NORMAL,
    },
  ],
};

const uvBufferLayout: GPUVertexBufferLayout = {
  arrayStride: 8,
  attributes: [
    {
      format: 'float32x2',
      offset: 0,
      shaderLocation: ShaderLocation.TEXTURE,
    },
  ],
};

export interface Shader {
  vertex: GPUVertexState;
  fragment: GPUFragmentState;
}

const shaderCaches: Map<ShaderType, Shader> = new Map();

export const createShader = ({ device, textureFormat }: Renderer, type: ShaderType): Shader => {
  const cachedShader = shaderCaches.get(type);
  let shader: Shader, shaderCode;
  let buffers: GPUVertexBufferLayout[];

  if (cachedShader) return cachedShader;

  switch (type) {
    case ShaderType.LIGHT:
      shaderCode = lightShaderCode;
      buffers = [colorBufferLayout, vertexBufferLayout, normalBufferLayout];
      break;
    case ShaderType.TEXTURE:
      shaderCode = textureShaderCode;
      buffers = [uvBufferLayout, vertexBufferLayout];
      break;
    default:
      shaderCode = defaultShaderCode;
      buffers = [colorBufferLayout, vertexBufferLayout];
      break;
  }
  shader = {
    vertex: {
      module: device.createShaderModule({ code: shaderCode.vertex }),
      entryPoint: 'main',
      buffers,
    },
    fragment: {
      module: device.createShaderModule({ code: shaderCode.fragment }),
      entryPoint: 'main',
      targets: [{ format: textureFormat }],
    },
  };
  shaderCaches.set(type, shader);
  return shader;
};