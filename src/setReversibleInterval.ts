/**
 * Creates an interval and returns a function to stop it.
 * @param {*} cb callback
 * @param {*} interval interval in ms
 */
const setReversibleInterval = (...args: Parameters<typeof setInterval>): (() => void) => {
	const ref = setInterval(...args);
	return () => clearInterval(ref);
};

export default setReversibleInterval;
