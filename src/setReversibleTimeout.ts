/**
 * Creates a timeout and returns a function to cancel it.
 * @param {*} cb callback
 * @param {*} timeout timeout in ms
 */
const setReversibleTimeout = (...args: Parameters<typeof setTimeout>): (() => void) => {
	const ref = setTimeout(...args);
	return () => clearTimeout(ref);
};

export default setReversibleTimeout;
