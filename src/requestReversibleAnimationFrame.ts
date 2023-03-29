/**
 * Registers an action to be performed on the next repaint and returns a function to cancel it.
 * @param {*} cb callback
 * @returns callback to cancel action
 */
function requestReversibleAnimationFrame(...args: Parameters<typeof requestAnimationFrame>): () => void {
	const ref = requestAnimationFrame(...args);
	return cancelAnimationFrame.bind(window, ref);
}

export default requestReversibleAnimationFrame;
