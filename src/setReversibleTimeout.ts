/**
 * creates a timeout and returns a function to cancel it
 * @param {*} cb callback
 * @param {*} timeout timeout in ms
 */
export const setReversibleTimeout = (...args: Parameters<typeof setTimeout>): (() => void) => {
	const ref = setTimeout(...args);
	return () => clearTimeout(ref);
};

export default setReversibleTimeout;
