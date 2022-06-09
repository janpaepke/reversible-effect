type EventMapMap =
	| [Document, DocumentEventMap]
	| [HTMLBodyElement, HTMLBodyElementEventMap]
	| [HTMLElement, HTMLElementEventMap]
	| [HTMLMediaElement, HTMLMediaElementEventMap]
	| [HTMLVideoElement, HTMLVideoElementEventMap]
	| [IDBOpenDBRequest, IDBOpenDBRequestEventMap]
	| [MathMLElement, MathMLElementEventMap]
	| [OfflineAudioContext, OfflineAudioContextEventMap]
	| [SVGElement, SVGElementEventMap]
	| [SVGSVGElement, SVGSVGElementEventMap]
	| [ServiceWorker, ServiceWorkerEventMap]
	| [Window, WindowEventMap]
	| [typeof window, WindowEventMap] // includes globalThis
	| [Worker, WorkerEventMap]
	| [XMLHttpRequest, XMLHttpRequestEventMap];

interface GenericInterface {
	addEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions
	): void;
	removeEventListener(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | EventListenerOptions
	): void;
}

type TargetsWithSpecificEvents = EventMapMap[0];
type EventMap<T extends TargetsWithSpecificEvents> = Extract<EventMapMap, [T, unknown]>[1];

/**
 * Adds the passed listener as an event listener to the passed event target, and returns a function which reverses the
 * effect of this function.
 * @param {*} target object the listener should be attached to
 * @param {*} type type of listener
 * @param {*} listener callback
 * @param {*} options Add Event listener options
 * @returns callback to remove event listener
 */

// Overload: Dom Targets with known events
function addReversibleEventListener<T extends TargetsWithSpecificEvents, K extends keyof EventMap<T>>(
	target: T,
	type: K,
	listener: (this: T, ev: EventMap<T>[K]) => unknown,
	options?: boolean | AddEventListenerOptions
): () => void;

// Overload: generic version
function addReversibleEventListener(
	target: GenericInterface,
	type: string,
	listener: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
): () => void;

// implementation
function addReversibleEventListener(
	target: GenericInterface,
	type: string,
	listener: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
): () => void {
	target.addEventListener(type, listener, options);
	return target.removeEventListener.bind(target, type, listener, options);
}

export default addReversibleEventListener;

// TODO: inference of generics function properties seems to break
// below example cannot resolve TouchEvent for `event` param in callback
// const test = <T extends HTMLElement>(x: T) => {
// 	registerEvent(x, 'touchcancel', event => {});
// };
