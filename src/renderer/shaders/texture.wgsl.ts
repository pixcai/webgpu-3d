export const vertex = `
  struct Input {
    [[location(0)]] uv: vec2<f32>;
    [[location(1)]] position: vec3<f32>;
  };

  struct Output {
    [[builtin(position)]] builtinPosition: vec4<f32>;
    [[location(0)]] uv: vec2<f32>;
    [[location(1)]] position: vec3<f32>;
  };

  struct Uniforms {
    mvpMat: mat4x4<f32>;
  };

  [[group(0), binding(0)]] var<uniform> uniforms: Uniforms;

  [[stage(vertex)]]
  fn main(input: Input) -> Output {
    var output: Output;
    output.builtinPosition = uniforms.mvpMat * vec4<f32>(input.position, 1.0);
    output.uv = input.uv;
    output.position = input.position;
    return output;
  }
`;

export const fragment = `
  struct Input {
    [[location(0)]] uv: vec2<f32>;
    [[location(1)]] position: vec3<f32>;
  };

  [[group(0), binding(1)]] var textureSampler: sampler;
  [[group(0), binding(2)]] var textureData: texture_2d<f32>;

  [[stage(fragment)]]
  fn main(input: Input) -> [[location(0)]] vec4<f32> {
    let color: vec3<f32> = textureSample(textureData, textureSampler, input.uv).rgb;
    return vec4<f32>(color, 1.0);
  }
`;