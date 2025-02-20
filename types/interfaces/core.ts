import { Matrix3x3ToMatrix4x4, Matrix3x3xMatrix3x3, Matrix4x4xMatrix4x4 } from "types/utils";
import type { Matrix4x4, Vec3 } from "./common";
import type { TsModels } from "./TsModels";
import { TransformVec3, TransformVec4 } from "types/trasform";
import type { Entity } from "types/core";

export interface EntityProps {
    model: string;
    position?: Vec3;
    rotation?: Vec3;
    scale?: Vec3;
    reflection?: { x: boolean, y: boolean, z: boolean };
    //TODO
    shear?: Vec3;
}

export interface EntityClass {
    model: string;
    position: Vec3;
    rotation: Vec3;
    scale: Vec3;
    reflection: { x:boolean, y:boolean, z: boolean };
    //TODO
    shear: Vec3;
    modelMatrix: Matrix4x4;

    computeModelMatrix(): Matrix4x4;
}

export interface CameraProps extends EntityProps {
    fov?: number;
    near?: number;
    far?: number;
}

export interface CameraClass extends EntityClass {
    fov: number,
    far: number,
    near: number,
}

export interface SceneProps {
    entities?: EntityClass[];
    cameras?: string[];
    activeCamera?: string;
}

export  interface SceneClass {
    entities: EntityClass[];
    cameras:  string[];
    activeCamera: string;
}