/**
 * Registers an action to be performed on the next repaint and returns a function to cancel it.
 * Takes the same arguments as {@link requestAnimationFrame}.
 * @returns callback to cancel action
 * @see https://developer.mozilla.org/docs/Web/API/Window/requestAnimationFrame
 */
function requestReversibleAnimationFrame(...args: Parameters<typeof requestAnimationFrame>): () => void {
	const ref = requestAnimationFrame(...args);
	return cancelAnimationFrame.bind(globalThis, ref);
}

export default requestReversibleAnimationFrame;
