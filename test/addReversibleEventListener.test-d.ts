import { expectType } from 'tsd';

/**
 * type tests
 */
import { addReversibleEventListener } from '..';

expectType<() => void>(addReversibleEventListener(window, 'click', () => void null));

// Document
addReversibleEventListener(document, 'abort', e => expectType<UIEvent>(e));
// HTMLBodyElement
addReversibleEventListener(document.body, 'orientationchange', e => expectType<Event>(e));
// HTMLElement
addReversibleEventListener(new HTMLElement(), 'drag', e => expectType<DragEvent>(e));
// HTMLMediaElement
addReversibleEventListener(new Audio(), 'encrypted', e => expectType<MediaEncryptedEvent>(e));
// HTMLVideoElement
addReversibleEventListener(new HTMLVideoElement(), 'enterpictureinpicture', e => expectType<PictureInPictureEvent>(e));
addReversibleEventListener(new HTMLVideoElement(), 'encrypted', e => expectType<MediaEncryptedEvent>(e));
// IDBOpenDBRequest
addReversibleEventListener(indexedDB.open(''), 'upgradeneeded', e => expectType<IDBVersionChangeEvent>(e));
// MathMLElement
addReversibleEventListener(new MathMLElement(), 'copy', e => expectType<ClipboardEvent>(e));
// OfflineAudioContext
addReversibleEventListener(new OfflineAudioContext(2, 44100 * 40, 44100), 'complete', e =>
	expectType<OfflineAudioCompletionEvent>(e)
);
// SVGElement
addReversibleEventListener(new SVGElement(), 'focus', e => expectType<FocusEvent>(e));
//SVGSVGElement
addReversibleEventListener(new SVGSVGElement(), 'storage', e => expectType<StorageEvent>(e));
// ServiceWorker
addReversibleEventListener(new ServiceWorker(), 'statechange', e => expectType<Event>(e));
addReversibleEventListener(new ServiceWorker(), 'error', e => expectType<ErrorEvent>(e));
// Window
addReversibleEventListener(window, 'click', e => expectType<PointerEvent>(e));
addReversibleEventListener(window, 'abort', e => expectType<UIEvent>(e));
// Worker
addReversibleEventListener(new Worker(''), 'message', e => expectType<MessageEvent>(e));
// XMLHttpRequest
addReversibleEventListener(new XMLHttpRequest(), 'readystatechange', e => expectType<Event>(e));
addReversibleEventListener(new XMLHttpRequest(), 'abort', e => expectType<ProgressEvent<XMLHttpRequestEventTarget>>(e));
