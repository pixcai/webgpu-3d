export const vertex = `
  struct Input {
    [[location(0)]] color: vec3<f32>;
    [[location(1)]] position: vec3<f32>;
    [[location(2)]] normal: vec3<f32>;
  };

  struct Output {
    [[builtin(position)]] builtinPosition: vec4<f32>;
    [[location(0)]] color: vec3<f32>;
    [[location(1)]] position: vec3<f32>;
    [[location(2)]] normal: vec3<f32>;
  };

  struct Uniforms {
    mvpMat: mat4x4<f32>;
  };

  [[group(0), binding(0)]] var<uniform> uniforms: Uniforms;

  [[stage(vertex)]]
  fn main(input: Input) -> Output {
    var output: Output;
    output.builtinPosition = uniforms.mvpMat * vec4<f32>(input.position, 1.0);
    output.color = input.color;
    output.position = input.position;
    output.normal = input.normal;
    return output;
  }
`;

export const fragment = `
  struct Input {
    [[location(0)]] color: vec3<f32>;
    [[location(1)]] position: vec3<f32>;
    [[location(2)]] normal: vec3<f32>;
  };

  struct Uniforms {
    eyePosition: vec3<f32>;
    lightPosition: vec3<f32>;
  };

  [[group(0), binding(1)]] var<uniform> uniforms: Uniforms;

  [[stage(fragment)]]
  fn main(input: Input) -> [[location(0)]] vec4<f32> {
    let ambientIntensity = 0.2;
    let diffuseIntensity = 0.8;
    let specularColor = vec3<f32>(1.0, 1.0, 1.0);
    let specularIntensity = 0.4;
    let shininess = 30.0;
    let isPhong = true;
    let N = normalize(input.normal);
    let V = normalize(uniforms.eyePosition - input.position);
    let L = normalize(uniforms.lightPosition - input.position);
    let H = normalize(L + V);
    let diffuse = diffuseIntensity * max(dot(N, L), 0.0);
    var specular: f32;

    if(isPhong){
      specular = specularIntensity * pow(max(dot(V, reflect(-L, N)),0.0), shininess);
    } else {
      specular = specularIntensity * pow(max(dot(N, H),0.0), shininess);
    }               
    return vec4<f32>(input.color * (ambientIntensity + diffuse) + specularColor * specular, 1.0);
  }
`;