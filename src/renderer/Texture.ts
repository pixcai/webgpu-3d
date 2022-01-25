import Renderer from './Renderer';

export class Texture {
  sampler!: GPUSampler;
  texture!: GPUTexture;

  static async load(renderer: Renderer, texturePath: string) {
    const image = document.createElement('img');
    image.src = texturePath;
    await image.decode();
    const imageBitmap = await createImageBitmap(image);
    const sampler = renderer.device.createSampler({
      minFilter: 'linear',
      magFilter: 'linear',
      addressModeU: 'repeat',
      addressModeV: 'repeat',
    });
    const texture = renderer.device.createTexture({
      size: [imageBitmap.width, imageBitmap.height, 1],
      format: 'rgba8unorm',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });
    renderer.device.queue.copyExternalImageToTexture(
      { source: imageBitmap },
      { texture },
      [imageBitmap.width, imageBitmap.height],
    );
    const textureInstance = new Texture();
    textureInstance.sampler = sampler;
    textureInstance.texture = texture;
    return textureInstance;
  }
}