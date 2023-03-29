/**
 * Creates an interval and returns a function to stop it.
 * @param {*} cb callback
 * @param {*} interval interval in ms
 * @returns callback to stop interval
 */
function setReversibleInterval(...args: Parameters<typeof setInterval>): () => void {
	const ref = setInterval(...args);
	return clearInterval.bind(global, ref); // interval-IDs are unique and never reused. multiple calls to clear with the same ID will have no effect.
}

export default setReversibleInterval;
