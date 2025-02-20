//@ts-ignore
import type {  Matrix4x4, TriVec4, Vec3, Vec4 } from "./interfaces/common";
import type { TsModels } from "./interfaces/TsModels";
import { cubeModel, ModelManager } from "./models";

const canvas: HTMLCanvasElement = document.querySelector("#screen-canvas") as HTMLCanvasElement;
if(canvas) {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
if(ctx) {
const CONSTANTS: {
    height: number,
    width: number,
} = {
    height: canvas.height,
    width: canvas.width,
}

//const cubemodel = await ModelManager.loadModelFromFile(require());

// const Scenes: Scene[] = [
//     // {
//     //     entities: [
//     //         {
//     //             model: ModelManager.getModelWithHash(cubemodel),
//     //             position: { x:0, y:0, z:0 },
//     //             rotation: { x:0, y:0, z:0 },
//     //             scale: { x:0, y:0, z:0 },
//     //             shear: { x:0, y:0, z:0 },
//     //             reflection: { x:0, y:0, z:0 },
//     //         }
//     //     ]
//     // },
//     // {
//     //     entities: [
//     //         {
//     //             model: cubeModel,
//     //             position: { x:0, y:0, z:0 },
//     //             rotation: { x:0, y:0, z:0 },
//     //             scale: { x:0, y:0, z:0 },
//     //             shear: { x:0, y:0, z:0 },
//     //             reflection: { x:0, y:0, z:0 },
//     //         }
//     //     ]
//     // }
// ]

// const Cameras: Camera[] = [
//     {
//         position: { x:0, y:0, z:0 },
//         fov: 90,
//         far: 1,
//         near: 1,
//         rotation: { x:0, y:0, z:0 },
//     }
// ]

function render(): void {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CONSTANTS.height, CONSTANTS.width);;

    drawModel(cubeModel.models[0]);
    return;
}

//O(n^2)
function drawModel(model: TsModels.ObjFile["models"][0]): void {
    model.faces.forEach((face: TsModels.Face)=>{
        const selectedTriangle: TsModels.VecFace[] = face.vertices;
        const triangle: TriVec4 = [model.vertices[selectedTriangle[0].vertexIndex],
             model.vertices[selectedTriangle[1].vertexIndex],
             model.vertices[selectedTriangle[2].vertexIndex]]

        ctx.beginPath();
        ctx.strokeStyle = "white"

        ctx.moveTo(triangle[0].x, triangle[0].y);
        ctx.lineTo(triangle[1].x * 100, triangle[2].y  * 100);
        ctx.stroke();

        ctx.lineTo(triangle[2].x * 100, triangle[2].y * 100);
        ctx.stroke();

        ctx.lineTo(triangle[0].x * 100, triangle[0].y * 100);
        ctx.stroke();

        ctx.closePath();
    })
    return;
}


let isRunnning: boolean = true;
let lastTime: DOMHighResTimeStamp = 0;
let deltaTime: number = 0;

document.addEventListener("visibilitychange", (event: Event) => {
    console.info("document.visibilityState", document.visibilityState);
    if (document.visibilityState == "hidden") {
        isRunnning = false;
        return;
    }
    lastTime = performance.now();
    isRunnning = true
    requestAnimationFrame(mainLoop);
});

function mainLoop(curretTime: DOMHighResTimeStamp) {
    if(!isRunnning) {
        return;
    }
    console.groupCollapsed("mainLoop");
    console.info("curretTime", curretTime);
    console.info("lastTime", lastTime);
    deltaTime = curretTime - lastTime;
    console.info("deltaTime", deltaTime);
    lastTime = curretTime;
    console.groupEnd();

    render();

    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);

} else {
    alert("CONTEXT NOT DEFINED")
}
} else {
    alert("CANVAS NOT FOUND")
}