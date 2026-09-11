/*
 * Environment-agnostic access to platform globals.
 *
 * The published declarations must compile in every environment — browser, Node, workers, or none at all — without
 * forcing a lib (e.g. DOM) onto consumers. Naming a global type that the consumer's environment lacks is a compile
 * error there, so globals are looked up through `typeof globalThis` instead: where a global is missing, the lookup
 * resolves to `never` rather than failing.
 *
 * The key is checked before the value's shape on purpose: `never extends X` is true, so a missing global would
 * otherwise slip through a shape check and infer overly permissive types.
 */

type Globals = typeof globalThis;

/** Type of the global value `K`, or `never` where the environment has no such global. */
export type GlobalValue<K extends string> = K extends keyof Globals ? Globals[K] : never;

/** Instance type of the global class `K`, or `never` where the environment has no such class. */
export type GlobalInstance<K extends string> = K extends keyof Globals
	? Globals[K] extends { prototype: infer Instance }
		? Instance
		: never
	: never;

/** Parameters of the global function `K`, or `never` (uncallable) where the environment has no such function. */
export type GlobalParameters<K extends string> = K extends keyof Globals
	? Globals[K] extends (...args: infer Args) => unknown
		? Args
		: never
	: never;

/*
 * Event maps are interfaces, not values, so they cannot be looked up through `globalThis`. Empty declarations make
 * their names resolve everywhere: where the environment provides them, these merge with the real maps (including
 * any augmentations, such as custom events a bundler adds to `WindowEventMap`); elsewhere they stay empty and unused.
 */
/* eslint-disable @typescript-eslint/no-empty-object-type */
declare global {
	interface DocumentEventMap {}
	interface HTMLBodyElementEventMap {}
	interface HTMLElementEventMap {}
	interface HTMLMediaElementEventMap {}
	interface HTMLVideoElementEventMap {}
	interface IDBOpenDBRequestEventMap {}
	interface MathMLElementEventMap {}
	interface OfflineAudioContextEventMap {}
	interface SVGElementEventMap {}
	interface SVGSVGElementEventMap {}
	interface ServiceWorkerEventMap {}
	interface WindowEventMap {}
	interface WorkerEventMap {}
	interface XMLHttpRequestEventMap {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */
