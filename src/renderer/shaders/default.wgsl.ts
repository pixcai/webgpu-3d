export const vertex = `
  struct Input {
    [[location(0)]] color: vec3<f32>;
    [[location(1)]] position: vec3<f32>;
  };

  struct Output {
    [[location(0)]] color: vec3<f32>;
    [[builtin(position)]] position: vec4<f32>;
  };

  struct Uniforms {
    mvpMat: mat4x4<f32>;
  };

  [[group(0), binding(0)]] var<uniform> uniforms: Uniforms;

  [[stage(vertex)]]
  fn main(input: Input) -> Output {
    var output: Output;
    output.color = input.color;
    output.position = uniforms.mvpMat * vec4<f32>(input.position, 1.0);
    return output;
  }
`;

export const fragment = `
  [[stage(fragment)]]
  fn main([[location(0)]] color: vec3<f32>) -> [[location(0)]] vec4<f32> {
    return vec4<f32>(color, 1.0);
  }
`;