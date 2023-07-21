"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTexture = void 0;
const GetTexture = (device, imageName, addressModeU = 'repeat', addressModeV = 'repeat') => __awaiter(void 0, void 0, void 0, function* () {
    // get image file
    const img = document.createElement('img');
    img.src = './assets/' + imageName;
    yield img.decode();
    const imageBitmap = yield createImageBitmap(img);
    // create sampler with linear filtering for smooth interpolation 
    const sampler = device.createSampler({
        minFilter: 'linear',
        magFilter: 'linear',
        addressModeU: addressModeU,
        addressModeV: addressModeV
    });
    // create texture
    const texture = device.createTexture({
        size: [imageBitmap.width, imageBitmap.height, 1],
        format: 'rgba8unorm',
        usage: GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.COPY_DST |
            GPUTextureUsage.RENDER_ATTACHMENT
    });
    device.queue.copyExternalImageToTexture({ source: imageBitmap }, { texture: texture }, [imageBitmap.width, imageBitmap.height]);
    return {
        texture,
        sampler
    };
});
exports.GetTexture = GetTexture;
//# sourceMappingURL=texture-data.js.map