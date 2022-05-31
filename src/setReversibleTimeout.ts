/**
 * Creates a timeout and returns a function to cancel it.
 * @param {*} cb callback
 * @param {*} timeout timeout in ms
 */
function setReversibleTimeout(...args: Parameters<typeof setTimeout>): () => void {
	const ref = global.setTimeout(...args);
	return global.clearTimeout.bind(global, ref); // timeout-IDs are unique and never reused. multiple calls to clear with the same ID will have no effect.
}

export default setReversibleTimeout;
