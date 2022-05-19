/**
 * creates an interval and returns a function to remove it
 * @param {*} cb callback
 * @param {*} interval interval in ms
 */
const reversibleInterval = (...args: Parameters<typeof setInterval>): (() => void) => {
	const ref = setInterval(...args);
	return () => clearInterval(ref);
};

export default reversibleInterval;
