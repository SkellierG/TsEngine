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

    protected constructor(entity?: EntityClass) {
        this._id = entity?.id ?? "";
        this._model = entity?.model ?? "";
        this._position = entity?.position ?? { x:0, y:0, z:0 };
        this._rotation = entity?.rotation ?? { x:0, y:0, z:0 };
        this._scale = entity?.scale ?? { x:0, y:0, z:0 };
        this._reflection = entity?.reflection ?? { x:false, y:false, z: false };
        this._shear = entity?.shear ?? { x:0, y:0, z:0 };
        this._modelMatrix = entity?.modelMatrix ?? [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    }

    static createEntity(props: EntityProps): Entity {
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

        const newEntity = new Entity();

        newEntity._id = id;
        newEntity._model = model;
        newEntity._position = position;
        newEntity._rotation = rotation;
        newEntity._scale = scale;
        newEntity._reflection = reflection;
        newEntity._shear = shear;
        newEntity._modelMatrix = newEntity.computeModelMatrix();

        return newEntity;
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
        const scaled = TransformVec4.scale(this._scale.x, this._scale.y, this._scale.z);
        const rotated = TransformVec4.rotate(this._rotation.x, this._rotation.y, this._rotation.z);
        //TODO
        //const sheared = TransformVec4.shearing(this._shear.x, this._shear.y, this._shear.z);
        const reclefted = TransformVec4.reflect(this._reflection.x, this._reflection.y, this._reflection.z);
        const translated = TransformVec4.translate(this._position.x, this._position.y, this._position.z);
    
        const finalMatrix = Matrix4x4Util.matrix4x4(Matrix4x4Util.matrix4x4(Matrix4x4Util.matrix4x4(scaled, rotated), reclefted),translated);
    
        this._modelMatrix = finalMatrix;
        return finalMatrix;
    }    
}

export class Camera extends Entity implements CameraClass {
    protected _fov: number;
    protected _far: number;
    protected _near: number;
    protected _perspectiveMatrix: Matrix4x4;

    protected constructor(entity: EntityClass) {
        super(entity);
        this._fov = 0
        this._near = 0
        this._far = 0
        this._perspectiveMatrix = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    }

    static createCamera(props: CameraProps): Camera {
        const {
            fov = 75,
            near = 0.1,
            far = 1000
        } = props;

        const baseEntity = Camera.createEntity(props);
        const newCamera = new Camera(baseEntity);

        newCamera._fov = fov;
        newCamera._near = near;
        newCamera._far = far;
        newCamera._perspectiveMatrix = newCamera.computePerspectiveMatrix();

        return newCamera;
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

    get perspectiveMatrix(): Matrix4x4 {
        return this._perspectiveMatrix;
    }
    computePerspectiveMatrix(): Matrix4x4 {
        const scale = 1 / Math.tan(this.fov * 0.5);

        this._perspectiveMatrix = [[scale,0,0,0],
                                   [0,scale,0,0],
                                   [0,0,-this.far / (this.far - this.near),-this.far * this.near / (this.far - this.near)],
                                   [0,0,-1,0]];

        return this._perspectiveMatrix;
    }
}


export class Scene implements SceneClass {
    protected _entities: Map<string, EntityClass>;
    protected _cameras: Map<string, boolean>;
    protected _activeCamera: string;

    protected constructor() {
        this._entities = new Map();
        this._cameras = new Map();
        this._activeCamera = "";
    }

    static createScene(props: SceneProps): Scene {
        const { entities = [], cameras = [], activeCamera = "" } = props;

        const newScene = new Scene();

        newScene.addEntity(...entities);
        newScene.addCamera(...cameras);

        if(activeCamera !== "") {
            newScene._activeCamera = newScene._cameras.has(activeCamera) ? activeCamera : cameras[0] || "";
        } else {
            newScene._activeCamera = cameras.includes(activeCamera) ? activeCamera : cameras[0] || "";
        }

        return newScene;
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
