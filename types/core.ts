import type { Vec3, Matrix4x4 } from "./interfaces/common";
import type { SceneClass, CameraClass, CameraProps, EntityClass, EntityProps, SceneProps } from "./interfaces/core";
import { TransformVec4 } from "./trasform";
import { Matrix4x4Util } from "./utils";

export class Entity implements EntityClass {
    protected _id: string;
    protected _model?: string;
    protected _position: Vec3;
    protected _rotation: Vec3;
    protected _scale: Vec3;
    protected _reflection: { x:boolean, y:boolean, z: boolean };
    protected _shear: Vec3;
    protected _modelMatrix: Matrix4x4;

    constructor(props: EntityProps) {
        const {
            id = crypto.randomUUID(),
            model,
            position = { x: 0, y: 0, z: 0 },
            rotation = { x: 0, y: 0, z: 0 },
            scale = { x: 1, y: 1, z: 1 },
            reflection = { x: false, y: false, z: false },
            //TODO
            shear = { x: 0, y: 0, z: 0 }
        } = props;

        this._id = id;
        this._model = model;
        this._position = position;
        this._rotation = rotation;
        this._scale = scale;
        this._reflection = reflection;
        this._shear = shear;
        this._modelMatrix = this.computeModelMatrix();
    }

    get id(): string {
        return this._id;
    }

    get model(): string | undefined {
        return this._model;
    }
    set model(hash: string) {
        this._model = hash;
    }

    get position(): Vec3 {
        return this._position;
    }
    set position(vec: Partial<Vec3>) {
        Object.assign(this._position, vec);
    }
    
    get rotation(): Vec3 {
        return this._rotation;
    }
    set rotation(vec: Partial<Vec3>) {
        Object.assign(this._rotation, vec);
    }
    
    get scale(): Vec3 {
        return this._scale;
    }
    set scale(vec: Partial<Vec3>) {
        Object.assign(this._scale, vec);
    }
    
    get reflection(): { x: boolean, y: boolean, z: boolean } {
        return this._reflection;
    }
    set reflection(vec: Partial<{ x: boolean, y: boolean, z: boolean }>) {
        Object.assign(this._reflection, vec);
    }
    
    get shear(): Vec3 {
        return this._shear;
    }
    set shear(vec: Partial<Vec3>) {
        Object.assign(this._shear, vec);
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

        const finalMatrix = Matrix4x4Util.matrix4x4(Matrix4x4Util.matrix4x4(Matrix4x4Util.matrix4x4(translated, rotated), scaled), reclefted);

        this._modelMatrix = finalMatrix;
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
        const { entities = [], cameras = [], activeCamera = "" } = props;

        this._entities = new Map();
        this._cameras = new Map();

        this.addEntity(...entities);
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

    getEntityById(id: string): EntityClass | undefined {
        return this._entities.get(id);
    }

    addEntity(...newEntities: EntityClass[]) {
        newEntities.forEach((entity) => {
            if (!this._entities.has(entity.id)) {
                this._entities.set(entity.id, entity);

                if (entity instanceof Camera) {
                    this._cameras.set(entity.id, true);
                }
            }
        });
    }

    deleteEntity(id: string) {
        if (this._entities.has(id)) {
            if (this._cameras.has(id)) {
                this.deleteCamera(id);
            }
            this._entities.delete(id);
        }
    }

    get cameras(): string[] {
        return Array.from(this._cameras.keys());
    }

    addCamera(...newCameras: string[]) {
        console.log(this._cameras);
        newCameras.forEach((id) => {
            this._cameras.set(id, true);
        });
    }

    deleteCamera(id: string) {
        if (this._cameras.has(id)) {
            this._cameras.delete(id);
            this._entities.delete(id);

            if (this._activeCamera === id) {
                this._activeCamera = this.cameras.length > 0 ? this.cameras[0] : "";
            }
        }
    }

    get activeCamera(): string {
        return this._activeCamera;
    }

    set activeCamera(id: string) {
        if (this._cameras.has(id)) {
            this._activeCamera = id;
        }
    }

    switchToNextCamera() {
        if (this._cameras.size > 1) {
            const index = this.cameras.indexOf(this._activeCamera);
            this._activeCamera = this.cameras[(index + 1) % this.cameras.length];
        }
    }

    switchToPreviousCamera() {
        if (this._cameras.size > 1) {
            const index = this.cameras.indexOf(this._activeCamera);
            this._activeCamera = this.cameras[(index - 1 + this.cameras.length) % this.cameras.length];
        }
    }
}
