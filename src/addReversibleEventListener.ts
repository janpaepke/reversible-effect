import type { GlobalInstance } from './environment';
import type { EventMapMap } from './eventMaps.generated';

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

type UnionToIntersection<U> = (U extends unknown ? (union: U) => void : never) extends (intersection: infer I) => void
	? I
	: never;

/*
 * The event maps of every known target `T` is assignable to, merged. Matching supertypes (rather than `T` itself)
 * covers subclasses as well — including ones the list cannot know, such as custom elements — and resolves to the most
 * specific map, since event maps extend their parents'. `T` is wrapped to keep a union target from distributing.
 */
type MatchingEventMaps<T> = EventMapMap extends infer Pair
	? Pair extends [infer Target, infer Map]
		? [T] extends [Target]
			? Map
			: never
		: never
	: never;
export type EventMapOf<T> = UnionToIntersection<MatchingEventMaps<T>>;

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
function addReversibleEventListener<T extends TargetsWithSpecificEvents, K extends keyof EventMapOf<T>>(
	target: T,
	type: K,
	listener: (this: T, ev: EventMapOf<T>[K]) => unknown,
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
