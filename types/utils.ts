import type { Matrix3x3, Matrix4x4, Vec3, Vec4 } from "./interfaces/common";

export function vec4xMatrix4x4(vec: Vec4, mat: Matrix4x4): Vec4 {
    return {
        x: vec.x*mat[0][0] + vec.y*mat[0][1] + vec.z*mat[0][2] + vec.w*mat[0][3],
        y: vec.x*mat[1][0] + vec.y*mat[1][1] + vec.z*mat[1][2] + vec.w*mat[1][3],
        z: vec.x*mat[2][0] + vec.y*mat[2][1] + vec.z*mat[2][2] + vec.w*mat[2][3],
        w: vec.x*mat[3][0] + vec.y*mat[3][1] + vec.z*mat[3][2] + vec.w*mat[3][3],
    };
}

export function vec3xMatrix3x3(vec: Vec3, mat: Matrix3x3): Vec3 {
    return {
        x: vec.x*mat[0][0] + vec.y*mat[0][1] + vec.z*mat[0][2],
        y: vec.x*mat[1][0] + vec.y*mat[1][1] + vec.z*mat[1][2],
        z: vec.x*mat[2][0] + vec.y*mat[2][1] + vec.z*mat[2][2],
    };
}

export function Matrix4x4xMatrix4x4(mat1: Matrix4x4, mat2: Matrix4x4): Matrix4x4 {
    const result: Matrix4x4 = [[0, 0, 0, 0],
                               [0, 0, 0, 0],
                               [0, 0, 0, 0],
                               [0, 0, 0, 0]];

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            result[i][j] =
                mat1[i][0] * mat2[0][j] +
                mat1[i][1] * mat2[1][j] +
                mat1[i][2] * mat2[2][j] +
                mat1[i][3] * mat2[3][j];
        }
    }

    return result;
}

export function Matrix3x3xMatrix3x3(mat1: Matrix3x3, mat2: Matrix3x3): Matrix3x3 {
    const result: Matrix3x3 = [[0, 0, 0],
                               [0, 0, 0],
                               [0, 0, 0]];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            result[i][j] =
                mat1[i][0] * mat2[0][j] +
                mat1[i][1] * mat2[1][j] +
                mat1[i][2] * mat2[2][j]
        }
    }

    return result;
}

export function Matrix3x3ToMatrix4x4(mat: Matrix3x3): Matrix4x4 { {
    return [
        [mat[0][0], mat[0][1], mat[0][2], 0],
        [mat[1][0], mat[1][1], mat[1][2], 0],
        [mat[2][0], mat[2][1], mat[2][2], 0],
        [0, 0, 0, 1]
    ]
    }
}

export function Matrix4x4ToMatrix3x3(mat: Matrix4x4): Matrix3x3 {
    return [
        [mat[0][0], mat[0][1], mat[0][2]],
        [mat[1][0], mat[1][1], mat[1][2]],
        [mat[2][0], mat[2][1], mat[2][2]],
    ]
}