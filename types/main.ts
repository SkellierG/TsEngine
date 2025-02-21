//@ts-ignore
import { Camera, Entity, Scene } from "./core";
import type { Matrix4x4, TriVec4 } from "./interfaces/common";
import type { TsModels } from "./interfaces/TsModels";
import { cubeModel, ModelManager } from "./models";
import { Matrix4x4Util } from "./utils";

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

const cubeModelHash: string = ModelManager.loadModelFromJSObject(cubeModel);
const camerauuid: string = crypto.randomUUID();

const Scenes: Scene[] = [
    new Scene({
        entities: [
            new Entity({
                model: cubeModelHash,
            }),
            new Camera({
                id: camerauuid,
            })
        ],
        activeCamera: camerauuid,
    })
]

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

const ACTIVE_SCENE: number = 0;

function render(): void {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CONSTANTS.height, CONSTANTS.width);

    const camera = Scenes[ACTIVE_SCENE].getEntityById(Scenes[ACTIVE_SCENE].activeCamera);
    if (!camera) return;

   const cameraMatrix = Matrix4x4Util.inverse(camera.computeModelMatrix());
    
    Scenes[ACTIVE_SCENE].entities.forEach((entity) => {
        if (!entity.model) return;

        const worldMatrix = entity.computeModelMatrix();
        
        const finalMatrix = Matrix4x4Util.matrix4x4(cameraMatrix, worldMatrix);

        const model = ModelManager.getModelWithHash(entity.model);

        if (model) drawModel(model, finalMatrix);
    });
}

function drawModel(FullModel: TsModels.ObjFile, transformMatrix: Matrix4x4) {
    FullModel.models.forEach((model)=>{
        model.vertices.forEach(vertex => {

            const transformedVertex = Matrix4x4Util.vec4(vertex, transformMatrix);

            //TODO
            const screenX = (transformedVertex.x + 1) * (CONSTANTS.width / 2);
            const screenY = (1 - transformedVertex.y) * (CONSTANTS.height / 2);

            ctx.fillStyle = "white";
            ctx.fillRect(screenX, screenY, 2, 2);
        });
    });
}


//drawModel(cubeModel.models[0]);

//O(n^2)
function drawTriangles(model: TsModels.ObjFile["models"][0]): void {
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
    //console.info("document.visibilityState", document.visibilityState);
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
    //console.groupCollapsed("mainLoop");
    //console.info("curretTime", curretTime);
    //console.info("lastTime", lastTime);
    deltaTime = curretTime - lastTime;
    //console.info("deltaTime", deltaTime);
    lastTime = curretTime;
    //console.groupEnd();

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