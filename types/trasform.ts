import type { Matrix3x3, Matrix4x4, Vec3, Vec4 } from "./interfaces/common";
import { TransformClass, type ReflectStrategy, type RotateAxisStrategy, type RotateStrategy, type ScaleStrategy, type ShearingStrategy, type TranslateStrategy } from "./interfaces/transform";
import { Matrix3x3Util, Matrix4x4Util } from "./utils";

class TransformVec4Class extends TransformClass<Matrix4x4> {
    rotate: RotateStrategy<Matrix4x4> = (alpha: number, beta: number, upsilon: number): Matrix4x4 => {
        return Matrix4x4Util.matrix4x4(Matrix4x4Util.matrix4x4(this.roll(alpha), this.pitch(beta)), this.yaw(upsilon))
    }

    roll: RotateAxisStrategy<Matrix4x4> = (alpha: number): Matrix4x4 => {
        const mat: Matrix4x4 = [[1, 0, 0, 0],
                                [0, Math.cos(alpha), -Math.sin(alpha), 0],
                                [0, Math.sin(alpha), Math.cos(alpha), 0],
                                [0, 0, 0, 1]];

        return mat;
    }

    pitch: RotateAxisStrategy<Matrix4x4> = (beta: number): Matrix4x4 => {
        const mat: Matrix4x4 = [[Math.cos(beta), 0, Math.sin(beta), 0],
                                [0, 1, 0, 0],
                                [-Math.sin(beta), 0, Math.cos(beta), 0],
                                [0, 0, 0, 1]];

        return mat;
    }

    yaw: RotateAxisStrategy<Matrix4x4> = (upsilon: number): Matrix4x4 => {
        const mat: Matrix4x4 = [[Math.cos(upsilon), -Math.sin(upsilon), 0, 0],
                                [Math.sin(upsilon), Math.cos(upsilon), 0, 0],
                                [0, 0, 1, 0],
                                [0, 0, 0, 1]];

        return mat;
    }

    translate: TranslateStrategy<Matrix4x4> = (x: number, y: number, z: number): Matrix4x4 => {
        const mat: Matrix4x4 = [[1, 0, 0, x],
                                [0, 1, 0, y],
                                [0, 0, 1, z],
                                [0, 0, 0, 1]];
        return mat;
    }
    scale: ScaleStrategy<Matrix4x4> = (x: number, y: number, z: number): Matrix4x4 => {
        const mat: Matrix4x4 = [[x, 0, 0, 0],
                                [0, y, 0, 0],
                                [0, 0, z, 0],
                                [0, 0, 0, 1]];

        return mat;
    }
    reflect: ReflectStrategy<Matrix4x4> = (x: boolean, y: boolean, z: boolean): Matrix4x4 => {
        const mat: Matrix4x4 = [[x?-1:1, 0, 0, 0],
                                [0, y?-1:1, 0, 0],
                                [0, 0, z?-1:1, 0],
                                [0, 0, 0, 1]];

        return mat;
    }
    //TODO
    shearing: ShearingStrategy<Matrix4x4> = (sh_xy: number, sh_yx: number): Matrix4x4 => {
        const mat: Matrix4x4 = [[1, 0, 0, 0],
                                [0, 1, 0, 0],
                                [0, 0, 1, 0],
                                [0, 0, 0, 1]];

        return mat;
    }
}

export const TransformVec4: TransformClass<Matrix4x4> = new TransformVec4Class();

class TransformVec3Class extends TransformClass<Matrix3x3> {
    rotate: RotateStrategy<Matrix3x3> = (alpha: number, beta: number, upsilon: number): Matrix3x3 => {
        return Matrix3x3Util.matrix3x3(Matrix3x3Util.matrix3x3(this.roll(alpha), this.pitch(beta)), this.yaw(upsilon))
    }
    roll: RotateAxisStrategy<Matrix3x3> = (alpha: number): Matrix3x3 => {
        const mat: Matrix3x3 = [[1, 0, 0],
                                [0, Math.cos(alpha), -Math.sin(alpha)],
                                [0, Math.sin(alpha), Math.cos(alpha)]];

        return mat;
    }

    pitch: RotateAxisStrategy<Matrix3x3> = (beta: number): Matrix3x3 => {
        const mat: Matrix3x3 = [[Math.cos(beta), 0, Math.sin(beta)],
                                [0, 1, 0],
                                [-Math.sin(beta), 0, Math.cos(beta)]];

        return mat;
    }
    yaw: RotateAxisStrategy<Matrix3x3> = (upsilon: number): Matrix3x3 => {
        const mat: Matrix3x3 = [[Math.cos(upsilon), -Math.sin(upsilon), 0],
                                [Math.sin(upsilon), Math.cos(upsilon), 0],
                                [0, 0, 1]];

        return mat;
    }

    translate: TranslateStrategy<Matrix3x3> = (x: number, y: number): Matrix3x3 => {
        const mat: Matrix3x3 = [[1, 0, x],
                                [0, 1, y],
                                [0, 0, 1]];

        return mat;
    }
    scale: ScaleStrategy<Matrix3x3> = (x: number, y: number): Matrix3x3 => {
        const mat: Matrix3x3 = [[x, 0, 0],
                                [0, y, 0],
                                [0, 0, 1]];

        return mat;
    }
    reflect: ReflectStrategy<Matrix3x3> = (x: boolean, y: boolean): Matrix3x3 => {
        const mat: Matrix3x3 = [[x?-1:1, 0, 0],
                                [0, y?-1:1, 0],
                                [0, 0, 1]];

        return mat;
    }
    //TODO
    shearing: ShearingStrategy<Matrix3x3> = (sh_xy: number, sh_yx: number): Matrix3x3 => {
        const mat: Matrix3x3 = [[1, 0, 0],
                                [0, 1, 0],
                                [0, 0, 1]];

        return mat;
    }
}

export const TransformVec3: TransformClass<Matrix3x3> = new TransformVec3Class();