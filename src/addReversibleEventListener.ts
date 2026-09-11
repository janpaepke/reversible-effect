import type { GlobalInstance, GlobalValue } from './environment';

type EventMapMap =
	| [GlobalInstance<'Document'>, DocumentEventMap]
	| [GlobalInstance<'HTMLBodyElement'>, HTMLBodyElementEventMap]
	| [GlobalInstance<'HTMLElement'>, HTMLElementEventMap]
	| [GlobalInstance<'HTMLMediaElement'>, HTMLMediaElementEventMap]
	| [GlobalInstance<'HTMLVideoElement'>, HTMLVideoElementEventMap]
	| [GlobalInstance<'IDBOpenDBRequest'>, IDBOpenDBRequestEventMap]
	| [GlobalInstance<'MathMLElement'>, MathMLElementEventMap]
	| [GlobalInstance<'OfflineAudioContext'>, OfflineAudioContextEventMap]
	| [GlobalInstance<'SVGElement'>, SVGElementEventMap]
	| [GlobalInstance<'SVGSVGElement'>, SVGSVGElementEventMap]
	| [GlobalInstance<'ServiceWorker'>, ServiceWorkerEventMap]
	| [GlobalInstance<'Window'>, WindowEventMap]
	| [GlobalValue<'window'>, WindowEventMap] // includes globalThis
	| [GlobalInstance<'Worker'>, WorkerEventMap]
	| [GlobalInstance<'XMLHttpRequest'>, XMLHttpRequestEventMap];

/*
 * Listener and option types follow the environment's own EventTarget (DOM or Node). Environments without one fall
 * back to structural types.
 */
type NativeEventTarget = GlobalInstance<'EventTarget'>;
type HasNativeEventTarget = [NativeEventTarget] extends [never] ? false : true;

type Listener = HasNativeEventTarget extends true
	? NonNullable<Parameters<NativeEventTarget['addEventListener']>[1]>
	: ((event: never) => unknown) | { handleEvent(event: never): unknown };

type AddListenerOptions = HasNativeEventTarget extends true
	? Parameters<NativeEventTarget['addEventListener']>[2]
	: boolean | { capture?: boolean; once?: boolean; passive?: boolean };

type RemoveListenerOptions = HasNativeEventTarget extends true
	? Parameters<NativeEventTarget['removeEventListener']>[2]
	: boolean | { capture?: boolean };

interface GenericInterface {
	addEventListener(type: string, listener: Listener, options?: AddListenerOptions): void;
	removeEventListener(type: string, listener: Listener, options?: RemoveListenerOptions): void;
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
	options?: AddListenerOptions
): () => void;

// Overload: generic version
function addReversibleEventListener(
	target: GenericInterface,
	type: string,
	listener: Listener,
	options?: AddListenerOptions
): () => void;

// implementation
function addReversibleEventListener(
	target: GenericInterface,
	type: string,
	listener: Listener,
	options?: AddListenerOptions
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
