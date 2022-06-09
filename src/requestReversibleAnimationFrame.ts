/**
 * Registers an action to be performed on the next repaint and returns a function to cancel it.
 * @param {*} cb callback
 * @returns callback to cancel action
 */
function requestReversibleAnimationFrame(...args: Parameters<typeof requestAnimationFrame>): () => void {
	const ref = window.requestAnimationFrame(...args);
	return window.cancelAnimationFrame.bind(window, ref);
}

export default requestReversibleAnimationFrame;
