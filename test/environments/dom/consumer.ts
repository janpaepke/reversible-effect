// Consumes the published declarations in a browser environment, including an augmented event map.
import { addReversibleEventListener, requestReversibleAnimationFrame } from 'reversible-effect';

declare global {
	interface WindowEventMap {
		'custom:event': CustomEvent<number>;
	}
}

// augmented events keep their type
addReversibleEventListener(window, 'custom:event', event => {
	const detail: number = event.detail;
	void detail;
});

// known events keep their precise type
addReversibleEventListener(document, 'keydown', event => {
	const key: string = event.key;
	void key;
});

// @ts-expect-error a keydown listener receives a KeyboardEvent, not a MouseEvent
addReversibleEventListener(document, 'keydown', (event: MouseEvent) => void event);

export const cancelFrame: () => void = requestReversibleAnimationFrame(time => {
	const timestamp: number = time;
	void timestamp;
});
