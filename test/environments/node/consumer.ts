// Consumes the published declarations in Node: no DOM lib, Node globals only.
import {
	addReversibleEventListener,
	requestReversibleAnimationFrame,
	requestReversibleIdleCallback,
	setReversibleInterval,
	setReversibleTimeout,
} from '../../../dist/index.js';

// timers keep Node's signatures, including extra arguments passed on to the callback
export const cancelTimeout: () => void = setReversibleTimeout(() => void null, 10);
export const cancelInterval: () => void = setReversibleInterval(() => void null, 10);
setReversibleTimeout((value: string) => void value, 10, 'passed on');
setReversibleInterval((a: number, b: number) => void [a, b], 10, 1, 2);

// @ts-expect-error the callback must be a function
setReversibleTimeout('not a function', 10);

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
