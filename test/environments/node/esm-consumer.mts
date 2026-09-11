// Consumes the published declarations from a Node ES module, which resolves the `import` entry of `exports`.
import { addReversibleEventListener, requestReversibleAnimationFrame, setReversibleTimeout } from 'reversible-effect';

export const cancelTimeout: () => void = setReversibleTimeout((value: string) => void value, 10, 'passed on');
export const removeListener: () => void = addReversibleEventListener(new EventTarget(), 'custom', () => void null);

// @ts-expect-error requestAnimationFrame does not exist in Node
requestReversibleAnimationFrame(() => void null);
