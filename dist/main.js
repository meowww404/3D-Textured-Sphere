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
const texture_1 = require("./texture");
const vertex_data_1 = require("./vertex_data");
const jquery_1 = __importDefault(require("jquery"));
require("./site.css");
const CreateShape = (ul, vl, textureFile, addressModeU, addressModeV, isAnimation) => __awaiter(void 0, void 0, void 0, function* () {
    const data = vertex_data_1.SphereData(2, 50, 30, [0, 0, 0], ul, vl);
    yield texture_1.CreateShapeWithTexture(data === null || data === void 0 ? void 0 : data.vertexData, data === null || data === void 0 ? void 0 : data.normalData, data === null || data === void 0 ? void 0 : data.uvData, textureFile, addressModeU, addressModeV, isAnimation);
});
let textureFile = 'earth.png';
let addressModeU = 'clamp-to-edge';
let addressModeV = 'clamp-to-edge';
let isAnimation = true;
let ul = 1;
let vl = 1;
CreateShape(ul, vl, textureFile, addressModeU, addressModeV, isAnimation);
jquery_1.default('#id-radio input:radio').on('click', function () {
    let val = jquery_1.default('input[name="options"]:checked').val();
    if (val === 'animation')
        isAnimation = true;
    else
        isAnimation = false;
    CreateShape(ul, vl, textureFile, addressModeU, addressModeV, isAnimation);
});
jquery_1.default('#btn-redraw').on('click', function () {
    var _a, _b;
    ul = parseFloat((_a = jquery_1.default('#id-ulength').val()) === null || _a === void 0 ? void 0 : _a.toString());
    vl = parseFloat((_b = jquery_1.default('#id-vlength').val()) === null || _b === void 0 ? void 0 : _b.toString());
    CreateShape(ul, vl, textureFile, addressModeU, addressModeV, isAnimation);
});
jquery_1.default('#id-image').on('change', function () {
    const ele = this;
    textureFile = ele.options[ele.selectedIndex].value + '.png';
    CreateShape(ul, vl, textureFile, addressModeU, addressModeV, isAnimation);
});
jquery_1.default('#id-addressu').on('change', function () {
    const ele = this;
    addressModeU = ele.options[ele.selectedIndex].value;
    CreateShape(ul, vl, textureFile, addressModeU, addressModeV, isAnimation);
});
jquery_1.default('#id-addressv').on('change', function () {
    const ele = this;
    addressModeV = ele.options[ele.selectedIndex].value;
    CreateShape(ul, vl, textureFile, addressModeU, addressModeV, isAnimation);
});
function reportWindowSize() {
    CreateShape(ul, vl, textureFile, addressModeU, addressModeV, isAnimation);
}
window.onresize = reportWindowSize;
//# sourceMappingURL=main.js.map