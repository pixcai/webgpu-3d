import Renderer from './Renderer';
// @ts-ignore
import * as defaultShaderCode from './shaders/default.wgsl';
// @ts-ignore
import * as lightShaderCode from './shaders/light.wgsl';

export const enum ShaderLocation {
  COLOR,
  VERTEX,
}

export const enum ShaderType {
  DEFAULT,
  LIGHT,
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

export interface Shader {
  vertex: GPUVertexState;
  fragment: GPUFragmentState;
}

const shaderCaches: Map<ShaderType, Shader> = new Map();

export const createShader = ({ device, textureFormat }: Renderer, type: ShaderType): Shader => {
  const cachedShader = shaderCaches.get(type);
  let shader: Shader, shaderCode;

  if (cachedShader) return cachedShader;

  switch (type) {
    case ShaderType.LIGHT:
      shaderCode = lightShaderCode;
      break;
    default:
      shaderCode = defaultShaderCode;
      break;
  }
  shader = {
    vertex: {
      module: device.createShaderModule({ code: shaderCode.vertex }),
      entryPoint: 'main',
      buffers: [colorBufferLayout, vertexBufferLayout],
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