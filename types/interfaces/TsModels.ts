import type { Vec3, Vec4, VecTexture } from "./common";

export declare namespace TsModels {
    type ObjFile = {
        models: ObjModel[];
        materialLibraries?: any[];
    }

    type ObjModel = {
        name: string;
        vertices: Vec4[];
        textureCoords?: VecTexture[];
        vertexNormals?: Vec3[];
        faces: Face[];
    }

    type Face = {
        material?: any;
        group?: string;
        smoothingGroup?: number;
        vertices: VecFace[];
    }

    type VecFace = {
        vertexIndex: number;
        textureCoordsIndex?: number;
        vertexNormalIndex?: number;
    }
}

export abstract class IModelManagerClass {
    protected abstract models: Map<string, TsModels.ObjFile>;
    abstract loadModelFromFile: (file: string)=>Promise<string>;
    abstract getModelWithHash: (hash: string)=>TsModels.ObjFile;
    abstract getAllModels: ()=>TsModels.ObjFile[]
}