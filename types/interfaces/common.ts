export type Vec4 = {
    x: number;
    y: number;
    z: number;
    w: number;
}

export type Vec3 = {
    x: number;
    y: number;
    z: number;
}

export type VecTexture = {
    u: number;
    v: number;
    w: number;
}

export type Matrix3x3 = [[number, number, number],
                         [number, number, number],
                         [number, number, number]];

export type Matrix4x4 = [[number, number, number, number],
                         [number, number, number, number],
                         [number, number, number, number],
                         [number, number, number, number]];

export type TriVec4 = [
    Vec4,
    Vec4,
    Vec4,
]

export type TriVec3 = [
    Vec3,
    Vec3,
    Vec3,
]