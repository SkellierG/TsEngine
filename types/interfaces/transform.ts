export type RotateStrategy<T> = (alpha: number, beta: number, upsilon: number) => T;
export type RotateAxisStrategy<T> = ( angle: number) => T;
export type TranslateStrategy<T> = (x: number, y: number, z: number)=>T
export type ScaleStrategy<T> = (x: number, y: number, z: number)=>T
export type ReflectStrategy<T> = (x: boolean, y: boolean, z: boolean)=>T
export type ShearingStrategy<T> = (sh_xy: number, sh_yx: number, sh_xz: number, sh_zx: number, sh_y: number)=>T

export abstract class TransformClass<T> {
    abstract rotate: RotateStrategy<T>;
    abstract roll: RotateAxisStrategy<T>;
    abstract pitch: RotateAxisStrategy<T>;
    abstract yaw: RotateAxisStrategy<T>;
    abstract translate: TranslateStrategy<T>;
    abstract scale: ScaleStrategy<T>;
    abstract reflect: ReflectStrategy<T>;
    abstract shearing: ShearingStrategy<T>
}