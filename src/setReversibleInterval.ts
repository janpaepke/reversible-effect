/**
 * Creates an interval and returns a function to stop it.
 * Takes the same arguments as {@link setInterval}.
 * @returns callback to stop interval
 * @see https://developer.mozilla.org/docs/Web/API/setInterval
 */
function setReversibleInterval(...args: Parameters<typeof setInterval>): () => void {
	const ref = setInterval(...args);
	return clearInterval.bind(globalThis, ref); // interval-IDs are unique and never reused. multiple calls to clear with the same ID will have no effect.
}

export default setReversibleInterval;
