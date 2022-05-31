/**
 * @jest-environment jsdom
 */

import { addReversibleEventListener } from '..';

afterEach(() => {
	jest.resetModules();
});

describe('setReversibleTimeout', () => {
	test('triggers', () => {
		const callback = jest.fn();
		const event = new MouseEvent('click');
		const options = { passive: true };
		jest.spyOn(window, 'addEventListener');
		expect(addEventListener).not.toHaveBeenCalled();
		addReversibleEventListener(window, 'click', callback, options);
		expect(addEventListener).toHaveBeenCalledTimes(1);
		expect(addEventListener).toHaveBeenCalledWith('click', callback, options);
		expect(callback).not.toHaveBeenCalled();
		window.dispatchEvent(event);
		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(event);
		window.dispatchEvent(event);
		expect(callback).toHaveBeenCalledTimes(2);
	});
	test('cancels', () => {
		const callback = jest.fn();
		const event = new MouseEvent('click');
		jest.spyOn(window, 'removeEventListener');
		expect(removeEventListener).not.toHaveBeenCalled();
		const cancel = addReversibleEventListener(window, 'click', callback);
		expect(removeEventListener).not.toHaveBeenCalled();
		cancel();
		cancel(); // subsequent call should have no effect
		window.dispatchEvent(event);
		expect(callback).not.toHaveBeenCalled();
	});
	test('predictably overlaps', () => {
		const callback = jest.fn();
		const event = new MouseEvent('click');
		const options = { passive: true };
		const cancel1 = addReversibleEventListener(window, 'click', callback, options);
		cancel1();
		window.dispatchEvent(event);
		expect(callback).not.toHaveBeenCalled();
		addReversibleEventListener(window, 'click', callback, options); // same params as cancel1
		cancel1(); // will also cancel second addition, even though it has its own cleanup function
		window.dispatchEvent(event);
		expect(callback).not.toHaveBeenCalled();
		addReversibleEventListener(window, 'click', callback, options); // add more
		addReversibleEventListener(window, 'click', callback, options); // add more
		window.dispatchEvent(event);
		expect(callback).toHaveBeenCalledTimes(1); // if the same reference is added multiple times it has no additional effect (-> https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
		// let's add more listeners, which are referentially different
		addReversibleEventListener(window, 'click', () => callback(), options);
		addReversibleEventListener(window, 'click', callback.bind(null), options);
		window.dispatchEvent(event);
		expect(callback).toHaveBeenCalledTimes(4); // the above two should fire as well now. (plus the original one makes 3 more calls)
	});
});
