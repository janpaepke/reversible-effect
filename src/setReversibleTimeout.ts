import type { GlobalParameters } from './environment';

/**
 * Creates a timeout and returns a function to cancel it.
 * Takes the same arguments as {@link setTimeout}.
 * @returns callback to cancel timeout
 * @see https://developer.mozilla.org/docs/Web/API/setTimeout
 */
function setReversibleTimeout(...args: GlobalParameters<'setTimeout'>): () => void {
	// eslint-disable-next-line @typescript-eslint/no-implied-eval -- the arguments are the original's, which accepts a string handler in browsers
	const ref = setTimeout(...args);
	return clearTimeout.bind(globalThis, ref); // timeout-IDs are unique and never reused. multiple calls to clear with the same ID will have no effect.
}

export default setReversibleTimeout;
