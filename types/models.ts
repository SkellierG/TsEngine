import { IModelManagerClass, type TsModels } from "./interfaces/TsModels";
import { hash } from "node:crypto";
import ObjFileParser from "obj-file-parser";
import { readFile } from "node:fs/promises";
import type { Vec3, VecTexture } from "./interfaces/common";

function convertObjFile(parsedContent: ObjFileParser.ObjFile): TsModels.ObjFile {
    return {
        models: parsedContent.models.map((model) => ({
            name: model.name,
            vertices: model.vertices.map((vertex) => ({ ...vertex, w: 1 })),
            textureCoords: model.textureCoords as VecTexture[],
            vertexNormals: model.vertexNormals as Vec3[],
            faces: model.faces.map((face) => ({
                ...face,
                vertices: face.vertices as TsModels.VecFace[],
            })),
        })),
        materialLibraries: parsedContent.materialLibraries,
    };
}


class ModelManagerClass extends IModelManagerClass {
    protected models: Map<string, TsModels.ObjFile>;

    constructor() {
        super();
        this.models = new Map();
    }

    loadModelFromFile: (file: string) => Promise<string> = async (file: string): Promise<string> => {
        const hashedFile: string = hash('sha256', file);
    
        const fileContent: string = await readFile(file, { encoding: 'utf-8' });
    
        const parsedContent: ObjFileParser.ObjFile = new ObjFileParser(fileContent, hashedFile).parse();
    
        const vec4Content: TsModels.ObjFile = convertObjFile(parsedContent);
    
        this.models.set(hashedFile, vec4Content);
    
        return hashedFile;
    }

    getModelWithHash: (hash: string) => TsModels.ObjFile = (hash: string): TsModels.ObjFile => {
        return this.models.get(hash) as TsModels.ObjFile;
    }

    getAllModels: () => TsModels.ObjFile[] = (): TsModels.ObjFile[] => {
        const result: TsModels.ObjFile[] = [];
        this.models.forEach((model)=>{
            result.push(model);
        })
        return result;
    }
}

export const ModelManager: IModelManagerClass = new ModelManagerClass();

export const cubeModel: TsModels.ObjFile = {
    models: [
        {
            name: "Testing cube",
            vertices: [
                { x: 0, y: 0, z: 0, w: 1 }, // 0
                { x: 1, y: 0, z: 0, w: 1 }, // 1
                { x: 1, y: 1, z: 0, w: 1 }, // 2
                { x: 0, y: 1, z: 0, w: 1 }, // 3
                { x: 0, y: 0, z: 1, w: 1 }, // 4
                { x: 1, y: 0, z: 1, w: 1 }, // 5
                { x: 1, y: 1, z: 1, w: 1 }, // 6
                { x: 0, y: 1, z: 1, w: 1 }  // 7
            ],
            textureCoords: [
                { u: 0, v: 0, w: 0 },
                { u: 1, v: 0, w: 0 },
                { u: 1, v: 1, w: 0 },
                { u: 0, v: 1, w: 0 }
            ],
            vertexNormals: [
                { x: 0, y: 0, z: -1}, // Frente
                { x: 0, y: 0, z: 1},  // Atrás
                { x: 0, y: -1, z: 0}, // Abajo
                { x: 0, y: 1, z: 0},  // Arriba
                { x: -1, y: 0, z: 0}, // Izquierda
                { x: 1, y: 0, z: 0}   // Derecha
            ],
            faces: [
                // Cara frontal (z = 0)
                {
                    vertices: [
                        { vertexIndex: 0, textureCoordsIndex: 0, vertexNormalIndex: 0 },
                        { vertexIndex: 1, textureCoordsIndex: 1, vertexNormalIndex: 0 },
                        { vertexIndex: 2, textureCoordsIndex: 2, vertexNormalIndex: 0 }
                    ]
                },
                {
                    vertices: [
                        { vertexIndex: 0, textureCoordsIndex: 0, vertexNormalIndex: 0 },
                        { vertexIndex: 2, textureCoordsIndex: 2, vertexNormalIndex: 0 },
                        { vertexIndex: 3, textureCoordsIndex: 3, vertexNormalIndex: 0 }
                    ]
                },

                // Cara trasera (z = 1)
                {
                    vertices: [
                        { vertexIndex: 4, textureCoordsIndex: 0, vertexNormalIndex: 1 },
                        { vertexIndex: 5, textureCoordsIndex: 1, vertexNormalIndex: 1 },
                        { vertexIndex: 6, textureCoordsIndex: 2, vertexNormalIndex: 1 }
                    ]
                },
                {
                    vertices: [
                        { vertexIndex: 4, textureCoordsIndex: 0, vertexNormalIndex: 1 },
                        { vertexIndex: 6, textureCoordsIndex: 2, vertexNormalIndex: 1 },
                        { vertexIndex: 7, textureCoordsIndex: 3, vertexNormalIndex: 1 }
                    ]
                },

                // Cara inferior (y = 0)
                {
                    vertices: [
                        { vertexIndex: 0, textureCoordsIndex: 0, vertexNormalIndex: 2 },
                        { vertexIndex: 1, textureCoordsIndex: 1, vertexNormalIndex: 2 },
                        { vertexIndex: 5, textureCoordsIndex: 2, vertexNormalIndex: 2 }
                    ]
                },
                {
                    vertices: [
                        { vertexIndex: 0, textureCoordsIndex: 0, vertexNormalIndex: 2 },
                        { vertexIndex: 5, textureCoordsIndex: 2, vertexNormalIndex: 2 },
                        { vertexIndex: 4, textureCoordsIndex: 3, vertexNormalIndex: 2 }
                    ]
                },

                // Cara superior (y = 1)
                {
                    vertices: [
                        { vertexIndex: 3, textureCoordsIndex: 0, vertexNormalIndex: 3 },
                        { vertexIndex: 2, textureCoordsIndex: 1, vertexNormalIndex: 3 },
                        { vertexIndex: 6, textureCoordsIndex: 2, vertexNormalIndex: 3 }
                    ]
                },
                {
                    vertices: [
                        { vertexIndex: 3, textureCoordsIndex: 0, vertexNormalIndex: 3 },
                        { vertexIndex: 6, textureCoordsIndex: 2, vertexNormalIndex: 3 },
                        { vertexIndex: 7, textureCoordsIndex: 3, vertexNormalIndex: 3 }
                    ]
                },

                // Cara izquierda (x = 0)
                {
                    vertices: [
                        { vertexIndex: 0, textureCoordsIndex: 0, vertexNormalIndex: 4 },
                        { vertexIndex: 3, textureCoordsIndex: 1, vertexNormalIndex: 4 },
                        { vertexIndex: 7, textureCoordsIndex: 2, vertexNormalIndex: 4 }
                    ]
                },
                {
                    vertices: [
                        { vertexIndex: 0, textureCoordsIndex: 0, vertexNormalIndex: 4 },
                        { vertexIndex: 7, textureCoordsIndex: 2, vertexNormalIndex: 4 },
                        { vertexIndex: 4, textureCoordsIndex: 3, vertexNormalIndex: 4 }
                    ]
                },

                // Cara derecha (x = 1)
                {
                    vertices: [
                        { vertexIndex: 1, textureCoordsIndex: 0, vertexNormalIndex: 5 },
                        { vertexIndex: 2, textureCoordsIndex: 1, vertexNormalIndex: 5 },
                        { vertexIndex: 6, textureCoordsIndex: 2, vertexNormalIndex: 5 }
                    ]
                },
                {
                    vertices: [
                        { vertexIndex: 1, textureCoordsIndex: 0, vertexNormalIndex: 5 },
                        { vertexIndex: 6, textureCoordsIndex: 2, vertexNormalIndex: 5 },
                        { vertexIndex: 5, textureCoordsIndex: 3, vertexNormalIndex: 5 }
                    ]
                }
            ]
        }
    ],
    materialLibraries: ["default_material.mtl"]
};