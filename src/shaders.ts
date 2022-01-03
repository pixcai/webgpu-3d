export type Shader = {
  vertex: GPUShaderModuleDescriptorWGSL,
  fragment: GPUShaderModuleDescriptorWGSL,
};

export const defaultShader: Shader = {
  vertex: {
    code: `
      struct Uniforms {
        mvpMat: mat4x4<f32>;
      };
      [[group(0), binding(0)]] var<uniform> uniforms: Uniforms;
      [[stage(vertex)]]
      fn main([[location(0)]] pos: vec3<f32>) -> [[builtin(position)]] vec4<f32> {
        return uniforms.mvpMat * vec4<f32>(pos, 1.0);
      }
    `,
  },
  fragment: {
    code: `
      [[stage(fragment)]]
      fn main() -> [[location(0)]] vec4<f32> {
        return vec4<f32>(1.0, 1.0, 0.0, 1.0);
      }
    `,
  },
};

export const lightShader: Shader = {
  vertex: {
    code: `
      struct Uniforms {
        vpMat: mat4x4<f32>;
        modelMat: mat4x4<f32>;
        normalMat: mat4x4<f32>;
      };
      [[group(0), binding(0)]] var<uniform> uniforms: Uniforms;
      struct Output {
        [[builtin(position)]] position: vec4<f32>;
        [[location(0)]] pos: vec4<f32>;
        [[location(1)]] normal: vec4<f32>;
      };
      [[stage(vertex)]]
      fn main([[location(0)]] pos: vec4<f32>, [[location(1)]] normal: vec4<f32>) -> Output {
        var output: Output;
        output.pos = uniforms.modelMat * pos;
        output.normal = uniforms.normalMat * normal;
        output.position = uniforms.vpMat * output.pos;
        return output;
      }
    `,
  },
  fragment: {
    code: `
      struct Uniforms {
        lightPos: vec4<f32>;
        eyePos: vec4<f32>;
      };
      [[group(0), binding(1)]] var<uniform> uniforms: Uniforms;
      [[stage(fragment)]]
      fn main([[location(0)]] pos: vec4<f32>, [[location(1)]] normal: vec4<f32>) -> [[location(0)]] vec4<f32> {
        let N: vec3<f32> = normalize(normal.xyz);
        let L: vec3<f32> = normalize(uniforms.lightPos.xyz - pos.xyz);
        let V: vec3<f32> = normalize(uniforms.eyePos.xyz - pos.xyz);
        let H: vec3<f32> = normalize(L + V);
        let diffuse: f32 = 0.8 * max(dot(N, L), 0.0);
        var specular: f32;
        var isPhong: i32 = 0;
        if (isPhong == 1) {
          specular = 0.4 * pow(max(dot(V, reflect(-L, N)), 0.0), 30.0);
        } else {
          specular = 0.4 * pow(max(dot(N, H), 0.0), 30.0);
        }
        let ambient: f32 = 0.2;
        let finalColor: vec3<f32> = vec3<f32>(1.0, 1.0, 0.0) * (ambient + diffuse) + vec3<f32>(1.0, 1.0, 1.0) * specular;
        return vec4<f32>(finalColor, 1.0);
      }
    `,
  },
};