import { expectTypeOf } from 'vitest';
import { addReversibleEventListener } from '..';

expectTypeOf(addReversibleEventListener(window, 'click', () => void null)).toEqualTypeOf<() => void>();

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
// Worker
addReversibleEventListener(new Worker(''), 'message', e => expectTypeOf(e).toEqualTypeOf<MessageEvent>());
// XMLHttpRequest
addReversibleEventListener(new XMLHttpRequest(), 'readystatechange', e => expectTypeOf(e).toEqualTypeOf<Event>());
addReversibleEventListener(new XMLHttpRequest(), 'abort', e =>
	expectTypeOf(e).toEqualTypeOf<ProgressEvent<XMLHttpRequestEventTarget>>()
);
