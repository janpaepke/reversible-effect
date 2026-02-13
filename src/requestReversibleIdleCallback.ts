/**
 * Queues a function to be called during a browser's idle periods and returns a function to cancel it.
 * @param args - same arguments as requestIdleCallback (callback, options?)
 * @returns callback to cancel idle callback
 */
function requestReversibleIdleCallback(...args: Parameters<typeof requestIdleCallback>): () => void {
	const ref = requestIdleCallback(...args);
	return cancelIdleCallback.bind(globalThis, ref);
}

export default requestReversibleIdleCallback;
