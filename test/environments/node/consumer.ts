// Consumes the published declarations in Node: no DOM lib, Node globals only.
import {
	addReversibleEventListener,
	requestReversibleAnimationFrame,
	requestReversibleIdleCallback,
	setReversibleInterval,
	setReversibleTimeout,
} from '../../../dist/index.js';

// timers keep Node's signatures
export const cancelTimeout: () => void = setReversibleTimeout(() => void null, 10);
export const cancelInterval: () => void = setReversibleInterval(() => void null, 10);

// Node's EventTarget goes through the generic overload, typed by Node's own listener and options
export const removeListener: () => void = addReversibleEventListener(
	new EventTarget(),
	'custom',
	(event: Event) => void event,
	{ once: true }
);

// @ts-expect-error a plain object is not an event target
addReversibleEventListener({}, 'custom', () => void null);

// @ts-expect-error requestAnimationFrame does not exist in Node
requestReversibleAnimationFrame(() => void null);

// @ts-expect-error requestIdleCallback does not exist in Node
requestReversibleIdleCallback(() => void null);
