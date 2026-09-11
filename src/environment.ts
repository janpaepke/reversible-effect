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

/** Instance type of the global class `K`, or `never` where the environment has no such class. */
export type GlobalInstance<K extends string> = K extends keyof Globals
	? Globals[K] extends { prototype: infer Instance }
		? Instance
		: never
	: never;

/*
 * Parameters of every overload of `F`, as a union of tuples. `Parameters<F>` only sees the last overload, which e.g.
 * drops the extra callback arguments Node's `setTimeout` accepts.
 */
type OverloadParameters<F> = F extends {
	(...args: infer A1): unknown;
	(...args: infer A2): unknown;
	(...args: infer A3): unknown;
	(...args: infer A4): unknown;
}
	? A1 | A2 | A3 | A4
	: F extends { (...args: infer A1): unknown; (...args: infer A2): unknown; (...args: infer A3): unknown }
		? A1 | A2 | A3
		: F extends { (...args: infer A1): unknown; (...args: infer A2): unknown }
			? A1 | A2
			: F extends (...args: infer A1) => unknown
				? A1
				: never;

/** Parameters of the global function `K` (any of its overloads), or `never` (uncallable) where it does not exist. */
export type GlobalParameters<K extends string> = K extends keyof Globals ? OverloadParameters<Globals[K]> : never;
