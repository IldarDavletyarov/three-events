import { Camera, Object3D, Renderer, Raycaster, Vector2 } from 'three';

const raycaster = new Raycaster();
const mouse = new Vector2();

type TCallback = (event: Event, el: Object3D) => void;

interface TMouseEvent extends Event {
	clientX: number;
	clientY: number;
}

type TCallbackItem = {
	callback: number;
	objectsId: number[];
	eventType: number;
	handler: (event: Event) => void;
};

const triggerHookedElements = (objects: Object3D[], event: TMouseEvent, renderer: Renderer, camera: Camera, callback: TCallback, recursiveFlag: boolean) =>
{
	const mouseX = event?.clientX - renderer.domElement.getBoundingClientRect().left;
	const mouseY = event?.clientY - renderer.domElement.getBoundingClientRect().top;
	mouse.x =   (mouseX / renderer.domElement.width) * 2 - 1;
	mouse.y = - (mouseY / renderer.domElement.height) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	raycaster.intersectObjects(objects, recursiveFlag).forEach(el => {
		callback(event, el.object);
	});
};

const hashCode = (string: string) => {
	let hash = 0, i, chr;
	if (string.length === 0) return hash;
	for (i = 0; i < string.length; i++) {
		chr   = string.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0;
	}
	return hash;
};

export default class ThreeEvents {
	renderer !: Renderer;
	camera !: Camera;
	recursiveFlag !: boolean;

	callbackList: TCallbackItem[] = [];

	constructor(renderer: Renderer, camera: Camera, recursiveFlag = false) {
		this.renderer = renderer;
		this.camera = camera;
		this.recursiveFlag = recursiveFlag;
	}

	public addEventListener(objects: Object3D[] | Object3D, eventType: string, callback: TCallback, ...options: any[]) {
		if (!Array.isArray(objects)) {
			objects = [objects];
		}
		const handler = (event: Event) => { triggerHookedElements(objects, event as TMouseEvent, this.renderer, this.camera, callback, this.recursiveFlag); };
		this.callbackList.push({
			callback: hashCode(callback.toString()),
			objectsId: objects.map(_ => _.id),
			handler,
			eventType: hashCode(eventType),
		});
		this.renderer.domElement.addEventListener(eventType, handler, ...options);
	}

	public removeEventListener(objects: Object3D[] | Object3D, eventType: string, callback: TCallback, ...options: any[]) {
		if (!Array.isArray(objects)) {
			objects = [objects];
		}
		const callbackItem = this.callbackList.find(_ =>
			_.eventType === hashCode(eventType) &&
			_.objectsId.length === objects.length && _.objectsId.every((val, i) => val === objects[i].id) &&
			_.callback === hashCode(callback.toString()));
		if (callbackItem) {
			this.renderer.domElement.removeEventListener(eventType, callbackItem.handler, ...options);
			const index = this.callbackList.indexOf(callbackItem);
			if (index > -1) {
				this.callbackList.splice(index, 1);
			}
		}
	}
}
