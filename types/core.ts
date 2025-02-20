import type { Vec3, Matrix4x4 } from "./interfaces/common";
import type { SceneClass, CameraClass, CameraProps, EntityClass, EntityProps, SceneProps } from "./interfaces/core";
import type { TsModels } from "./interfaces/TsModels";
import { TransformVec4 } from "./trasform";
import { Matrix4x4xMatrix4x4 } from "./utils";
import { hash } from 'node:crypto';

export class Entity implements EntityClass {
    protected _model: string;
    protected _position: Vec3;
    protected _rotation: Vec3;
    protected _scale: Vec3;
    protected _reflection: { x:boolean, y:boolean, z: boolean };
    protected _shear: Vec3;
    protected _modelMatrix: Matrix4x4;

    constructor(props: EntityProps) {
        const {
            model,
            position = { x: 0, y: 0, z: 0 },
            rotation = { x: 0, y: 0, z: 0 },
            scale = { x: 1, y: 1, z: 1 },
            reflection = { x: false, y: false, z: false },
            //TODO
            shear = { x: 0, y: 0, z: 0 }
        } = props;

        this._model = model;
        this._position = position;
        this._rotation = rotation;
        this._scale = scale;
        this._reflection = reflection;
        this._shear = shear;
        this._modelMatrix = this.computeModelMatrix();
    }

    get model(): string {
        return this._model;
    }
    set model(hash: string) {
        this._model = hash;
    }

    get position(): Vec3 {
        return this._position;
    }
    set position(vec: Vec3) {
        this._position = vec;
    }

    get rotation(): Vec3 {
        return this._rotation;
    }
    set rotation(vec: Vec3) {
        this._rotation = vec;
    }
    
    get scale(): Vec3 {
        return this._scale;
    }
    set scale(vec: Vec3) {
        this._scale = vec;
    }

    get reflection(): { x:boolean, y:boolean, z: boolean } {
        return this._reflection;
    }
    set reflection(vec: { x:boolean, y:boolean, z: boolean }) {
        this._reflection = vec;
    }

    get shear(): Vec3 {
        return this._shear;
    }
    set shear(vec: Vec3) {
        this._shear = vec;
    }

    get modelMatrix(): Matrix4x4 {
        return this._modelMatrix;
    }

    computeModelMatrix(): Matrix4x4 {
        const translated = TransformVec4.translate(this._position.x, this._position.y, this._position.z);
        const rotated = TransformVec4.rotate(this._rotation.x, this._rotation.y, this._rotation.z);
        const scaled = TransformVec4.scale(this._scale.x, this._scale.y, this._scale.z);
        const reclefted = TransformVec4.reflect(this._reflection.x, this._reflection.y, this._reflection.z);
        //TODO
        //const sheared = TransformVec4.shearing(this._shear.x, this._shear.y, this._shear.z);

        const finalMatrix = Matrix4x4xMatrix4x4(Matrix4x4xMatrix4x4(Matrix4x4xMatrix4x4(translated, rotated), scaled), reclefted);

        return finalMatrix;
    }
}

export class Camera extends Entity implements CameraClass {
    protected _fov: number;
    protected _far: number;
    protected _near: number;

    constructor(props: CameraProps) {
        super(props);

        const {
            fov = 75,
            near = 0.1,
            far = 1000
        } = props;

        this._fov = fov;
        this._near = near;
        this._far = far;
    }

    get fov(): number {
        return this._fov;
    }
    set fov(angle: number) {
        this._fov = angle;
    }

    get near(): number {
        return this._near;
    }
    set near(distance: number) {
        this._near = distance;
    }

    get far(): number {
        return this._far;
    }
    set far(distance: number) {
        this._far = distance;
    }
}


export class Scene implements SceneClass {
    protected _entities: Map<string, EntityClass>;
    protected _cameras: Map<string, boolean>;
    protected _activeCamera: string;

    constructor(props: SceneProps) {
        const { entities = [], cameras = [], activeCamera = "" } = props

        this._entities = new Map();
        this.addEntity(...entities);
        this._cameras = new Map();
        this.addCamera(...cameras);

        if (cameras.length > 0) {
            this._activeCamera = cameras.includes(activeCamera) ? activeCamera : cameras[0];
        } else {
            this._activeCamera = "";
        }
    }

    get entities(): EntityClass[] {
        return Array.from(this._entities.values());
    }

    addEntity(...newEntities: EntityClass[]) {
        newEntities.forEach((entity) => {
            const hashed = hash('sha256', entity.model)
            if (!this._entities.has(hashed)) {
                this._entities.set(hashed, entity);

                if (entity instanceof Camera) {
                    this._cameras.set(hashed, true);
                }
            }
        });
    }

    deleteEntity(hash: string) {
        if(this._entities.has(hash)) {
            if (this._cameras.has(hash)) {
                this.deleteCamera(hash)
            }
            this._entities.delete(hash);
        }
    }

    get cameras(): string[] {
        return Array.from(this._cameras.keys());
    }

    addCamera(...newCameras: string[]) {
        newCameras.forEach((hash) => {
            this._cameras.set(hash, true);
        });
    }

    deleteCamera(hash: string) {
        if (this._cameras.has(hash)) {
            this._cameras.delete(hash);
            this._entities.delete(hash);

            if (this._activeCamera === hash) {
                this._activeCamera = this.cameras.length > 0 ? this.cameras[0] : "";
            }
        }
    }

    get activeCamera(): string {
        return this._activeCamera;
    }

    set activeCamera(hash: string) {
        if (this._cameras.has(hash)) {
            this._activeCamera = hash;
        }
    }
}
