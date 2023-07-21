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
exports.CheckWebGPU = exports.InitGPU = exports.CreateGPUBuffer = exports.CreateGPUBufferUint = exports.CreateViewProjection = exports.CreateTransforms = exports.CreateAnimation = void 0;
const gl_matrix_1 = require("gl-matrix");
const CreateAnimation = (draw, rotation = gl_matrix_1.vec3.fromValues(0, 0, 0), isAnimation = true) => {
    function step() {
        if (isAnimation) {
            rotation[0] += 0.01;
            rotation[1] += 0.01;
            rotation[2] += 0.01;
        }
        else {
            rotation = [0, 0, 0];
        }
        draw();
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
};
exports.CreateAnimation = CreateAnimation;
const CreateTransforms = (modelMat, translation = [0, 0, 0], rotation = [0, 0, 0], scaling = [1, 1, 1]) => {
    const rotateXMat = gl_matrix_1.mat4.create();
    const rotateYMat = gl_matrix_1.mat4.create();
    const rotateZMat = gl_matrix_1.mat4.create();
    const translateMat = gl_matrix_1.mat4.create();
    const scaleMat = gl_matrix_1.mat4.create();
    //perform indivisual transformations
    gl_matrix_1.mat4.fromTranslation(translateMat, translation);
    gl_matrix_1.mat4.fromXRotation(rotateXMat, rotation[0]);
    gl_matrix_1.mat4.fromYRotation(rotateYMat, rotation[1]);
    gl_matrix_1.mat4.fromZRotation(rotateZMat, rotation[2]);
    gl_matrix_1.mat4.fromScaling(scaleMat, scaling);
    //combine all transformation matrices together to form a final transform matrix: modelMat
    gl_matrix_1.mat4.multiply(modelMat, rotateXMat, scaleMat);
    gl_matrix_1.mat4.multiply(modelMat, rotateYMat, modelMat);
    gl_matrix_1.mat4.multiply(modelMat, rotateZMat, modelMat);
    gl_matrix_1.mat4.multiply(modelMat, translateMat, modelMat);
};
exports.CreateTransforms = CreateTransforms;
const CreateViewProjection = (respectRatio = 1.0, cameraPosition = [2, 2, 4], lookDirection = [0, 0, 0], upDirection = [0, 1, 0]) => {
    const viewMatrix = gl_matrix_1.mat4.create();
    const projectionMatrix = gl_matrix_1.mat4.create();
    const viewProjectionMatrix = gl_matrix_1.mat4.create();
    gl_matrix_1.mat4.perspective(projectionMatrix, 2 * Math.PI / 5, respectRatio, 0.1, 100.0);
    gl_matrix_1.mat4.lookAt(viewMatrix, cameraPosition, lookDirection, upDirection);
    gl_matrix_1.mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
    const cameraOption = {
        eye: cameraPosition,
        center: lookDirection,
        zoomMax: 100,
        zoomSpeed: 2
    };
    return {
        viewMatrix,
        projectionMatrix,
        viewProjectionMatrix,
        cameraOption
    };
};
exports.CreateViewProjection = CreateViewProjection;
const CreateGPUBufferUint = (device, data, usageFlag = GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST) => {
    const buffer = device.createBuffer({
        size: data.byteLength,
        usage: usageFlag,
        mappedAtCreation: true
    });
    new Uint32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();
    return buffer;
};
exports.CreateGPUBufferUint = CreateGPUBufferUint;
const CreateGPUBuffer = (device, data, usageFlag = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST) => {
    const buffer = device.createBuffer({
        size: data.byteLength,
        usage: usageFlag,
        mappedAtCreation: true
    });
    new Float32Array(buffer.getMappedRange()).set(data);
    buffer.unmap();
    return buffer;
};
exports.CreateGPUBuffer = CreateGPUBuffer;
const InitGPU = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const checkgpu = exports.CheckWebGPU();
    if (checkgpu.includes('Your current browser does not support WebGPU!')) {
        console.log(checkgpu);
        throw ('Your current browser does not support WebGPU!');
    }
    const canvas = document.getElementById('canvas-webgpu');
    const adapter = yield ((_a = navigator.gpu) === null || _a === void 0 ? void 0 : _a.requestAdapter());
    const device = yield (adapter === null || adapter === void 0 ? void 0 : adapter.requestDevice());
    const context = canvas.getContext('webgpu');
    /*const devicePixelRatio = window.devicePixelRatio || 1;
       const size = [
           canvas.clientWidth * devicePixelRatio,
           canvas.clientHeight * devicePixelRatio,
       ];*/
    //const format = context.getPreferredFormat(adapter!);
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device: device,
        format: format,
        //size: size
        alphaMode: 'opaque'
    });
    return { device, canvas, format, context };
});
exports.InitGPU = InitGPU;
/*export const InitGPU = async () => {
    const checkgpu = CheckWebGPU();
    if(checkgpu.includes('Your current browser does not support WebGPU!')){
        console.log(checkgpu);
        throw('Your current browser does not support WebGPU!');
    }
    const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice() as GPUDevice;
    const context = canvas.getContext('gpupresent') as GPUPresentationContext;
    const format = 'bgra8unorm';
    context.configure({
        device: device,
        format: format
    });
    return{ device, canvas, format, context };
};*/
const CheckWebGPU = () => {
    let result = 'Great, your current browser supports WebGPU!';
    if (!navigator.gpu) {
        result = `Your current browser does not support WebGPU! Make sure you are on a system 
                    with WebGPU enabled. Currently, SPIR-WebGPU is only supported in  
                    <a href="https://www.google.com/chrome/canary/">Chrome canary</a>
                    with the flag "enable-unsafe-webgpu" enabled. See the 
                    <a href="https://github.com/gpuweb/gpuweb/wiki/Implementation-Status"> 
                    Implementation Status</a> page for more details.                   
                `;
    }
    const canvas = document.getElementById('canvas-webgpu');
    const div = document.getElementsByClassName('item2')[0];
    canvas.width = div.offsetWidth;
    canvas.height = div.offsetHeight;
    function windowResize() {
        canvas.width = div.offsetWidth;
        canvas.height = div.offsetHeight;
    }
    ;
    window.addEventListener('resize', windowResize);
    return result;
};
exports.CheckWebGPU = CheckWebGPU;
//# sourceMappingURL=helper.js.map