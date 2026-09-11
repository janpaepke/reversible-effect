import { describe, expectTypeOf, test } from 'vitest';
import { addReversibleEventListener } from '..';

declare global {
	interface WindowEventMap {
		'test:augmented': CustomEvent<number>;
	}
}

describe('addReversibleEventListener', () => {
	test('returns a reverse callback', () => {
		expectTypeOf(addReversibleEventListener(window, 'click', () => void null)).toEqualTypeOf<() => void>();
	});

	test('types the events of known targets', () => {
		// Document
		addReversibleEventListener(document, 'abort', e => expectTypeOf(e).toEqualTypeOf<UIEvent>());
		// HTMLBodyElement
		addReversibleEventListener(document.body, 'orientationchange', e => expectTypeOf(e).toEqualTypeOf<Event>());
		// HTMLElement
		addReversibleEventListener(new HTMLElement(), 'drag', e => expectTypeOf(e).toEqualTypeOf<DragEvent>());
		// HTMLMediaElement
		addReversibleEventListener(new Audio(), 'encrypted', e => expectTypeOf(e).toEqualTypeOf<MediaEncryptedEvent>());
		// HTMLVideoElement
		addReversibleEventListener(new HTMLVideoElement(), 'enterpictureinpicture', e =>
			expectTypeOf(e).toEqualTypeOf<PictureInPictureEvent>()
		);
		addReversibleEventListener(new HTMLVideoElement(), 'encrypted', e =>
			expectTypeOf(e).toEqualTypeOf<MediaEncryptedEvent>()
		);
		// IDBOpenDBRequest
		addReversibleEventListener(indexedDB.open(''), 'upgradeneeded', e =>
			expectTypeOf(e).toEqualTypeOf<IDBVersionChangeEvent>()
		);
		// MathMLElement
		addReversibleEventListener(new MathMLElement(), 'copy', e => expectTypeOf(e).toEqualTypeOf<ClipboardEvent>());
		// OfflineAudioContext
		addReversibleEventListener(new OfflineAudioContext(2, 44100 * 40, 44100), 'complete', e =>
			expectTypeOf(e).toEqualTypeOf<OfflineAudioCompletionEvent>()
		);
		// SVGElement
		addReversibleEventListener(new SVGElement(), 'focus', e => expectTypeOf(e).toEqualTypeOf<FocusEvent>());
		//SVGSVGElement
		addReversibleEventListener(new SVGSVGElement(), 'storage', e => expectTypeOf(e).toEqualTypeOf<StorageEvent>());
		// ServiceWorker
		addReversibleEventListener(new ServiceWorker(), 'statechange', e => expectTypeOf(e).toEqualTypeOf<Event>());
		addReversibleEventListener(new ServiceWorker(), 'error', e => expectTypeOf(e).toEqualTypeOf<ErrorEvent>());
		// Window
		addReversibleEventListener(window, 'click', e => expectTypeOf(e).toEqualTypeOf<PointerEvent>());
		addReversibleEventListener(window, 'abort', e => expectTypeOf(e).toEqualTypeOf<UIEvent>());
		// WebSocket, MediaQueryList
		addReversibleEventListener(new WebSocket(''), 'message', e => expectTypeOf(e).toEqualTypeOf<MessageEvent>());
		addReversibleEventListener(matchMedia(''), 'change', e => expectTypeOf(e).toEqualTypeOf<MediaQueryListEvent>());
		// Worker
		addReversibleEventListener(new Worker(''), 'message', e => expectTypeOf(e).toEqualTypeOf<MessageEvent>());
		// XMLHttpRequest
		addReversibleEventListener(new XMLHttpRequest(), 'readystatechange', e => expectTypeOf(e).toEqualTypeOf<Event>());
		addReversibleEventListener(new XMLHttpRequest(), 'abort', e =>
			expectTypeOf(e).toEqualTypeOf<ProgressEvent<XMLHttpRequestEventTarget>>()
		);
	});

	test('types augmented event maps', () => {
		addReversibleEventListener(window, 'test:augmented', e => expectTypeOf(e).toEqualTypeOf<CustomEvent<number>>());
	});

	test('types subclasses by their parent', () => {
		// subclasses with members of their own get their parent's events
		addReversibleEventListener(document.createElement('div'), 'keydown', e =>
			expectTypeOf(e).toEqualTypeOf<KeyboardEvent>()
		);
		// so do custom elements
		class CustomElement extends HTMLElement {
			custom = true;
		}
		addReversibleEventListener(new CustomElement(), 'focus', e => expectTypeOf(e).toEqualTypeOf<FocusEvent>());
	});

	test('falls back to the generic overload for unknown events', () => {
		addReversibleEventListener(document.createElement('div'), 'custom-event', e =>
			expectTypeOf(e).toEqualTypeOf<Event>()
		);
		// @ts-expect-error a keydown listener receives a KeyboardEvent
		addReversibleEventListener(document.createElement('div'), 'keydown', (e: MouseEvent) => void e);
	});
});
