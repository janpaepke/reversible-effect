/**
 * Queues a function to be called during a browser's idle periods and returns a function to cancel it.
 * Takes the same arguments as {@link requestIdleCallback}.
 * @returns callback to cancel idle callback
 * @see https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback
 */
function requestReversibleIdleCallback(...args: Parameters<typeof requestIdleCallback>): () => void {
	const ref = requestIdleCallback(...args);
	return cancelIdleCallback.bind(globalThis, ref);
}

export default requestReversibleIdleCallback;
