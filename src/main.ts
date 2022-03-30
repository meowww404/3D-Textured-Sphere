import { CreateShapeWithTexture } from './texture';
import { SphereData } from './vertex_data';
import $ from 'jquery';
import "./site.css";

const CreateShape = async (ul:number, vl:number, textureFile:string, 
    addressModeU:GPUAddressMode, addressModeV:GPUAddressMode, isAnimation:boolean) => {
    const data = SphereData(2, 50, 30, [0,0,0], ul, vl);
    await CreateShapeWithTexture(data?.vertexData!, data?.normalData!, data?.uvData!, textureFile, addressModeU, addressModeV, isAnimation);
}

let textureFile = 'earth.png';
let addressModeU = 'clamp-to-edge' as GPUAddressMode;
let addressModeV = 'clamp-to-edge' as GPUAddressMode;
let isAnimation = true;
let ul = 1;
let vl = 1;
CreateShape(ul, vl, textureFile, addressModeU, addressModeV, isAnimation);

$('#id-radio input:radio').on('click', function(){
    let val = $('input[name="options"]:checked').val();
    if(val === 'animation') isAnimation = true;
    else isAnimation = false;
    CreateShape(ul, vl, textureFile, addressModeU, addressModeV, isAnimation);
});

$('#btn-redraw').on('click', function(){
    ul = parseFloat($('#id-ulength').val()?.toString() as string);
    vl = parseFloat($('#id-vlength').val()?.toString() as string);
    CreateShape(ul, vl, textureFile, addressModeU, addressModeV, isAnimation);
});

$('#id-image').on('change',function(){
    const ele = this as any;
    textureFile = ele.options[ele.selectedIndex].value + '.png';
    CreateShape(ul, vl, textureFile, addressModeU, addressModeV, isAnimation);
});

$('#id-addressu').on('change',function(){
    const ele = this as any;
    addressModeU = ele.options[ele.selectedIndex].value as GPUAddressMode;
    CreateShape(ul, vl, textureFile, addressModeU, addressModeV, isAnimation);
});

$('#id-addressv').on('change',function(){
    const ele = this as any;
    addressModeV = ele.options[ele.selectedIndex].value;
    CreateShape(ul, vl, textureFile, addressModeU, addressModeV, isAnimation);
});

function reportWindowSize() {
    CreateShape(ul, vl, textureFile, addressModeU, addressModeV, isAnimation);
}
window.onresize = reportWindowSize;