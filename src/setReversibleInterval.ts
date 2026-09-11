import type { GlobalParameters } from './environment';

/**
 * Creates an interval and returns a function to stop it.
 * Takes the same arguments as {@link setInterval}.
 * @returns callback to stop interval
 * @see https://developer.mozilla.org/docs/Web/API/setInterval
 */
function setReversibleInterval(...args: GlobalParameters<'setInterval'>): () => void {
	// eslint-disable-next-line @typescript-eslint/no-implied-eval -- the arguments are the original's, which accepts a string handler in browsers
	const ref = setInterval(...args);
	return clearInterval.bind(globalThis, ref); // interval-IDs are unique and never reused. multiple calls to clear with the same ID will have no effect.
}

export default setReversibleInterval;
