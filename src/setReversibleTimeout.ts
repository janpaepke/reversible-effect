/**
 * Creates a timeout and returns a function to cancel it.
 * @param {*} cb callback
 * @param {*} timeout timeout in ms
 * @returns callback to cancel timeout
 */
function setReversibleTimeout(...args: Parameters<typeof setTimeout>): () => void {
	const ref = setTimeout(...args);
	return clearTimeout.bind(globalThis, ref); // timeout-IDs are unique and never reused. multiple calls to clear with the same ID will have no effect.
}

export default setReversibleTimeout;
