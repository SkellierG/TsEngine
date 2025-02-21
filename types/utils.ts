import type { Matrix3x3, Matrix4x4, Vec3, Vec4 } from "./interfaces/common";
import SHA256 from "crypto-js/sha256";

export class Matrix4x4Util {
    static vec4(vec: Vec4, mat: Matrix4x4): Vec4 {
        return {
            x: vec.x*mat[0][0] + vec.y*mat[0][1] + vec.z*mat[0][2] + vec.w*mat[0][3],
            y: vec.x*mat[1][0] + vec.y*mat[1][1] + vec.z*mat[1][2] + vec.w*mat[1][3],
            z: vec.x*mat[2][0] + vec.y*mat[2][1] + vec.z*mat[2][2] + vec.w*mat[2][3],
            w: vec.x*mat[3][0] + vec.y*mat[3][1] + vec.z*mat[3][2] + vec.w*mat[3][3],
        };
    }

    static matrix4x4(mat1: Matrix4x4, mat2: Matrix4x4): Matrix4x4 {
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

    static toMatrix3x3(mat: Matrix4x4): Matrix3x3 {
        return [
            [mat[0][0], mat[0][1], mat[0][2]],
            [mat[1][0], mat[1][1], mat[1][2]],
            [mat[2][0], mat[2][1], mat[2][2]],
        ]
    }

    static inverse(mat: Matrix4x4): Matrix4x4 {
        const m = mat.flat();
        const inv = new Array(16);
        const det = 
            m[0] * (m[5] * (m[10] * m[15] - m[11] * m[14]) - m[6] * (m[9] * m[15] - m[11] * m[13]) + m[7] * (m[9] * m[14] - m[10] * m[13])) -
            m[1] * (m[4] * (m[10] * m[15] - m[11] * m[14]) - m[6] * (m[8] * m[15] - m[11] * m[12]) + m[7] * (m[8] * m[14] - m[10] * m[12])) +
            m[2] * (m[4] * (m[9] * m[15] - m[11] * m[13]) - m[5] * (m[8] * m[15] - m[11] * m[12]) + m[7] * (m[8] * m[13] - m[9] * m[12])) -
            m[3] * (m[4] * (m[9] * m[14] - m[10] * m[13]) - m[5] * (m[8] * m[14] - m[10] * m[12]) + m[6] * (m[8] * m[13] - m[9] * m[12]));
        
        if (det === 0) return mat;
        
        const invDet = 1 / det;
        
        for (let i = 0; i < 16; i++) {
            inv[i] = inv[i] * invDet;
        }
        
        return [
            [inv[0], inv[1], inv[2], inv[3]],
            [inv[4], inv[5], inv[6], inv[7]],
            [inv[8], inv[9], inv[10], inv[11]],
            [inv[12], inv[13], inv[14], inv[15]],
        ];
    }
}

export class Matrix3x3Util {
    static vec3(vec: Vec3, mat: Matrix3x3): Vec3 {
        return {
            x: vec.x*mat[0][0] + vec.y*mat[0][1] + vec.z*mat[0][2],
            y: vec.x*mat[1][0] + vec.y*mat[1][1] + vec.z*mat[1][2],
            z: vec.x*mat[2][0] + vec.y*mat[2][1] + vec.z*mat[2][2],
        };
    }

    static matrix3x3(mat1: Matrix3x3, mat2: Matrix3x3): Matrix3x3 {
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

    static toMatrix4x4(mat: Matrix3x3): Matrix4x4 { {
        return [
            [mat[0][0], mat[0][1], mat[0][2], 0],
            [mat[1][0], mat[1][1], mat[1][2], 0],
            [mat[2][0], mat[2][1], mat[2][2], 0],
            [0, 0, 0, 1]
        ]
        }
    }

    static inverse(mat: Matrix3x3): Matrix3x3 {
        const det = 
            mat[0][0] * (mat[1][1] * mat[2][2] - mat[1][2] * mat[2][1]) -
            mat[0][1] * (mat[1][0] * mat[2][2] - mat[1][2] * mat[2][0]) +
            mat[0][2] * (mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0]);
        
        if (det === 0) return mat;
        
        const invDet = 1 / det;
        
        return [
            [
                (mat[1][1] * mat[2][2] - mat[1][2] * mat[2][1]) * invDet,
                (mat[0][2] * mat[2][1] - mat[0][1] * mat[2][2]) * invDet,
                (mat[0][1] * mat[1][2] - mat[0][2] * mat[1][1]) * invDet,
            ],
            [
                (mat[1][2] * mat[2][0] - mat[1][0] * mat[2][2]) * invDet,
                (mat[0][0] * mat[2][2] - mat[0][2] * mat[2][0]) * invDet,
                (mat[0][2] * mat[1][0] - mat[0][0] * mat[1][2]) * invDet,
            ],
            [
                (mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0]) * invDet,
                (mat[0][1] * mat[2][0] - mat[0][0] * mat[2][1]) * invDet,
                (mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0]) * invDet,
            ],
        ];
    }
}

export function hash(input: string): string {
    return SHA256(input).toString();
}
