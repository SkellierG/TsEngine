//@ts-ignore
import { Camera, Entity, Scene } from "./core";
import type { Matrix4x4, TriVec4 } from "./interfaces/common";
import type { CameraClass } from "./interfaces/core";
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
const teapotModelHash: string = await ModelManager.loadModelFromFile("./models/FinalBaseMesh.obj")
console.log(ModelManager.getModelWithHash(teapotModelHash))
const camerauuid: string = crypto.randomUUID();

const Scenes: Scene[] = [
    Scene.createScene({
        entities: [
            // Entity.createEntity({
            //     model: cubeModelHash,
            //     scale: {x:1, y:1, z:1},
            //     reflection: {x:false, y:true, z:false},
            //     position: {x:-70, y:-20, z:1}
            // }),
            Entity.createEntity({
                model: teapotModelHash,
                scale: {x:0.5, y:0.5, z:0.5},
                position: {x:-100, y:-100, z:0}
            }),
            Camera.createCamera({
                id: camerauuid,
            })
        ],
        activeCamera: camerauuid,
    })
]

const ACTIVE_SCENE: number = 0;

let angleofrotationtest = 0;

function render(): void {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CONSTANTS.height, CONSTANTS.width);

    //console.log("Scenes[ACTIVE_SCENE]", Scenes[ACTIVE_SCENE])

    const camera: Camera | undefined = Scenes[ACTIVE_SCENE].getEntityById(Scenes[ACTIVE_SCENE].activeCamera) as Camera;

    if (!camera) return;

   // console.log("camera.computeModelMatrix()", camera.computeModelMatrix())

    const cameraMatrix = Matrix4x4Util.inverse(camera.computeModelMatrix());

    //console.log("cameraMatrix", cameraMatrix);
    
    Scenes[ACTIVE_SCENE].entities.forEach((entity) => {
        if (!entity.model) return;

        //@ts-ignore
        //console.log(entity.scale)
        //console.log(entity.rotation)
        entity.rotation = {x: angleofrotationtest, y: angleofrotationtest , z: angleofrotationtest};
        angleofrotationtest = angleofrotationtest + Math.PI/16;
        if(angleofrotationtest > 2*Math.PI) angleofrotationtest = 0
        //console.log(angleofrotationtest);

        const worldMatrix = entity.computeModelMatrix();
        
        const finalMatrix = Matrix4x4Util.matrix4x4(cameraMatrix, worldMatrix);

        const model = ModelManager.getModelWithHash(entity.model);

        if (model) renderModel(model, finalMatrix, camera.perspectiveMatrix);
    });
}

function applyTransformation(model: TsModels.ObjFile, transformMatrix: Matrix4x4): TsModels.ObjFile {
    const transformedModel: TsModels.ObjFile = JSON.parse(JSON.stringify(model));

    transformedModel.models.forEach((model) => {
        model.vertices = model.vertices.map(vertex => {
            const transformedVertex = Matrix4x4Util.vec4(vertex, transformMatrix);
            return transformedVertex;
        });
    });

    return transformedModel;
}

function drawTriangles(models: TsModels.ObjFile["models"], perspectiveMatrix: Matrix4x4): void {
    models.forEach((model) => {
        //console.log("model", model)
        model.faces.forEach((face: TsModels.Face) => {
            //console.log("face", face)
            const selectedTriangle: TsModels.VecFace[] = face.vertices;
            //console.log("selectedTriangle", selectedTriangle)

            const triangle: TriVec4 = [
                model.vertices[selectedTriangle[0].vertexIndex],
                model.vertices[selectedTriangle[1].vertexIndex],
                model.vertices[selectedTriangle[2].vertexIndex]
            ];

            //console.log("triangle", triangle)

            //projection matrix (actually NO)
            const screenCoords: [number, number][] = triangle.map(vertex => {
                //console.log("vertex", vertex)
                // const screenX = ((vertex.x) + 1) * (CONSTANTS.width / 3);
                // const screenY = (1 - (vertex.y)) * (CONSTANTS.height / 3);
                // const screenX = ((vertex?.x ?? 0) + 1) * (CONSTANTS.width / 3);
                // const screenY = (1 - (vertex?.y ?? 0)) * (CONSTANTS.height / 3);
                const perpectiveVertex = Matrix4x4Util.vec4(vertex, perspectiveMatrix);
                const screenX = perpectiveVertex.x;
                const screenY = perpectiveVertex.y;
                return [screenX, screenY];
            });

            //console.log(screenCoords);

            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.moveTo(screenCoords[0][0], screenCoords[0][1]);
            ctx.lineTo(screenCoords[1][0], screenCoords[1][1]);
            ctx.lineTo(screenCoords[2][0], screenCoords[2][1]);
            ctx.closePath();
            ctx.stroke();
        });
    });
}

function renderModel(FullModel: TsModels.ObjFile, transformMatrix: Matrix4x4, perspectiveMatrix: Matrix4x4): void {
    const transformedModel = applyTransformation(FullModel, transformMatrix);

    drawTriangles(transformedModel.models, perspectiveMatrix);
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