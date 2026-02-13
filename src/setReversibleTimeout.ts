/**
 * Creates a timeout and returns a function to cancel it.
 * Takes the same arguments as {@link setTimeout}.
 * @returns callback to cancel timeout
 * @see https://developer.mozilla.org/docs/Web/API/setTimeout
 */
function setReversibleTimeout(...args: Parameters<typeof setTimeout>): () => void {
	const ref = setTimeout(...args);
	return clearTimeout.bind(globalThis, ref); // timeout-IDs are unique and never reused. multiple calls to clear with the same ID will have no effect.
}

export default setReversibleTimeout;
