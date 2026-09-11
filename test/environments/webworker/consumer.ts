// Consumes the published declarations inside a dedicated web worker.
import { addReversibleEventListener, setReversibleTimeout } from '../../../dist/index.js';

// the worker's global scope receives typed messages
addReversibleEventListener(self, 'message', event => {
	const data: unknown = event.data;
	void data;
});

export const cancelTimeout: () => void = setReversibleTimeout(() => void null, 10);
