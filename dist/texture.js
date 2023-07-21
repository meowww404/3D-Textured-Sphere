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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateShapeWithTexture = void 0;
const helper_1 = require("./helper");
const shader_wgsl_1 = __importDefault(require("./shader.wgsl"));
const texture_data_1 = require("./texture-data");
const gl_matrix_1 = require("gl-matrix");
const createCamera = require('3d-view-controls');
let ambientIntensity = 0.2;
let diffuseIntensity = 0.8;
let specularIntensity = 0.4;
let shininess = 30;
let specularColor = [1, 1, 1];
let isPhong = 0;
let isTwoSideLighting = 1;
const CreateShapeWithTexture = (vertexData, normalData, uvData, textureFile = 'brick.png', normalMapFile = 'normalmap.png', addressModeU = 'repeat', addressModeV = 'repeat', isAnimation = true) => __awaiter(void 0, void 0, void 0, function* () {
    const gpu = yield helper_1.InitGPU();
    const device = gpu.device;
    // create vertex buffers
    const numberOfVertices = vertexData.length / 3;
    const vertexBuffer = helper_1.CreateGPUBuffer(device, vertexData);
    const normalBuffer = helper_1.CreateGPUBuffer(device, normalData);
    const uvBuffer = helper_1.CreateGPUBuffer(device, uvData);
    const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module: device.createShaderModule({
                code: shader_wgsl_1.default
            }),
            entryPoint: "vs_main",
            buffers: [
                {
                    arrayStride: 12,
                    attributes: [{
                            shaderLocation: 0,
                            format: "float32x3",
                            offset: 0
                        }]
                },
                {
                    arrayStride: 12,
                    attributes: [{
                            shaderLocation: 1,
                            format: "float32x3",
                            offset: 0
                        }]
                },
                {
                    arrayStride: 8,
                    attributes: [{
                            shaderLocation: 2,
                            format: "float32x2",
                            offset: 0
                        }]
                }
            ]
        },
        fragment: {
            module: device.createShaderModule({
                code: shader_wgsl_1.default
            }),
            entryPoint: "fs_main",
            targets: [
                {
                    format: gpu.format
                }
            ]
        },
        primitive: {
            topology: "triangle-list",
        },
        depthStencil: {
            format: "depth24plus",
            depthWriteEnabled: true,
            depthCompare: "less"
        }
    });
    // create uniform data
    const normalMatrix = gl_matrix_1.mat4.create();
    const modelMatrix = gl_matrix_1.mat4.create();
    let vMatrix = gl_matrix_1.mat4.create();
    let vpMatrix = gl_matrix_1.mat4.create();
    const vp = helper_1.CreateViewProjection(gpu.canvas.width / gpu.canvas.height);
    vpMatrix = vp.viewProjectionMatrix;
    // add rotation and camera:
    let rotation = gl_matrix_1.vec3.fromValues(0, 0, 0);
    var camera = createCamera(gpu.canvas, vp.cameraOption);
    let eyePosition = new Float32Array(vp.cameraOption.eye);
    let lightPosition = eyePosition;
    // create uniform buffer and layout
    const vertexUniformBuffer = device.createBuffer({
        size: 192,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    const fragmentUniformBuffer = device.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    const light_params = [
        ambientIntensity,
        diffuseIntensity,
        specularIntensity,
        shininess,
        specularColor,
        isPhong,
        isTwoSideLighting,
    ];
    const lightUniformBuffer = device.createBuffer({
        size: 36,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    //if(isAnimation){
    device.queue.writeBuffer(vertexUniformBuffer, 0, vp.viewProjectionMatrix);
    device.queue.writeBuffer(fragmentUniformBuffer, 0, lightPosition);
    device.queue.writeBuffer(fragmentUniformBuffer, 16, eyePosition);
    device.queue.writeBuffer(lightUniformBuffer, 0, new Float32Array(light_params.flat()));
    //}
    // get texture and sampler data
    const ts = yield texture_data_1.GetTexture(device, textureFile, addressModeU, addressModeV);
    const normalMap = yield texture_data_1.GetTexture(device, normalMapFile, addressModeU, addressModeV);  // load the normal map

    const uniformBindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: vertexUniformBuffer,
                    offset: 0,
                    size: 192
                }
            },
            {
                binding: 1,
                resource: {
                    buffer: fragmentUniformBuffer,
                    offset: 0,
                    size: 32
                }
            },
            {
                binding: 2,
                resource: {
                    buffer: lightUniformBuffer,
                    offset: 0,
                    size: 36
                }
            },
            {
                binding: 3,
                resource: ts.sampler
            },
            {
                binding: 4,
                resource: ts.texture.createView()
            }
        ]
    });
    let textureView = gpu.context.getCurrentTexture().createView();
    const depthTexture = device.createTexture({
        size: [gpu.canvas.width, gpu.canvas.height, 1],
        format: "depth24plus",
        usage: GPUTextureUsage.RENDER_ATTACHMENT
    });
    const renderPassDescription = {
        colorAttachments: [{
                view: textureView,
                clearValue: { r: 0.2, g: 0.247, b: 0.314, a: 1.0 },
                loadOp: 'clear',
                storeOp: 'store'
            }],
        depthStencilAttachment: {
            view: depthTexture.createView(),
            depthClearValue: 1.0,
            depthLoadOp: 'clear',
            depthStoreOp: "store",
            //stencilLoadValue: 0,
            //stencilStoreOp: "store"
        }
    };
    function draw() {
        if (!isAnimation) {
            if (camera.tick()) {
                const pMatrix = vp.projectionMatrix;
                vMatrix = camera.matrix;
                gl_matrix_1.mat4.multiply(vpMatrix, pMatrix, vMatrix);
                eyePosition = new Float32Array(camera.eye.flat());
                lightPosition = eyePosition;
                device.queue.writeBuffer(vertexUniformBuffer, 0, vpMatrix);
                device.queue.writeBuffer(fragmentUniformBuffer, 0, eyePosition);
                device.queue.writeBuffer(fragmentUniformBuffer, 16, lightPosition);
            }
        }
        helper_1.CreateTransforms(modelMatrix, [0, 0, 0], rotation);
        gl_matrix_1.mat4.invert(normalMatrix, modelMatrix);
        gl_matrix_1.mat4.transpose(normalMatrix, normalMatrix);
        device.queue.writeBuffer(vertexUniformBuffer, 64, modelMatrix);
        device.queue.writeBuffer(vertexUniformBuffer, 128, normalMatrix);
        textureView = gpu.context.getCurrentTexture().createView();
        renderPassDescription.colorAttachments[0].view = textureView;
        const commandEncoder = device.createCommandEncoder();
        const renderPass = commandEncoder.beginRenderPass(renderPassDescription);
        renderPass.setPipeline(pipeline);
        renderPass.setVertexBuffer(0, vertexBuffer);
        renderPass.setVertexBuffer(1, normalBuffer);
        renderPass.setVertexBuffer(2, uvBuffer);
        renderPass.setBindGroup(0, uniformBindGroup);
        renderPass.draw(numberOfVertices);
        renderPass.end();
        device.queue.submit([commandEncoder.finish()]);
    }
    helper_1.CreateAnimation(draw, rotation, isAnimation);
});
exports.CreateShapeWithTexture = CreateShapeWithTexture;
//# sourceMappingURL=texture.js.map