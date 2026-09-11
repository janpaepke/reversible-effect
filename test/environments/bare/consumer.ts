// Consumes the published declarations with neither DOM nor Node globals.
import { addReversibleEventListener, setReversibleTimeout } from 'reversible-effect';

// without a native EventTarget, any structurally compatible target is accepted
const emitter = {
	addEventListener(type: string, listener: unknown) {
		void [type, listener];
	},
	removeEventListener(type: string, listener: unknown) {
		void [type, listener];
	},
};
export const removeListener: () => void = addReversibleEventListener(emitter, 'custom', () => void null);

// @ts-expect-error setTimeout does not exist without DOM or Node
setReversibleTimeout(() => void null, 10);
