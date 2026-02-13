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
 * Adds an event listener and returns a function to remove it.
 * @param target - object the listener should be attached to
 * @param type - event type
 * @param listener - event handler callback
 * @param options - addEventListener options
 * @returns callback to remove event listener
 * @see https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener
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
// 	addReversibleEventListener(x, 'touchcancel', event => {});
// };
