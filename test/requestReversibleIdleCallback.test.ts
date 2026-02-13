/**
 * @jest-environment jsdom
 */

import { requestReversibleIdleCallback } from '..';

// jsdom doesn't support requestIdleCallback, so we mock it
let idleHandle = 0;
let idleCallback: IdleRequestCallback | null = null;

beforeAll(() => {
	window.requestIdleCallback = jest.fn((cb: IdleRequestCallback) => {
		idleCallback = cb;
		return ++idleHandle;
	});
	window.cancelIdleCallback = jest.fn(() => {
		idleCallback = null;
	});
});
afterEach(() => {
	jest.resetAllMocks();
	idleCallback = null;
});

const fakeDeadline: IdleDeadline = {
	didTimeout: false,
	timeRemaining: () => 50,
};

describe('requestReversibleIdleCallback', () => {
	test('triggers', () => {
		const callback = jest.fn();
		requestReversibleIdleCallback(callback);
		expect(requestIdleCallback).toHaveBeenCalledTimes(1);
		expect(requestIdleCallback).toHaveBeenLastCalledWith(callback);
		expect(callback).not.toHaveBeenCalled();
		idleCallback?.(fakeDeadline);
		expect(callback).toHaveBeenCalledTimes(1);
	});
	test('passes options', () => {
		const callback = jest.fn();
		requestReversibleIdleCallback(callback, { timeout: 1000 });
		expect(requestIdleCallback).toHaveBeenCalledWith(callback, { timeout: 1000 });
	});
	test('cancels', () => {
		const callback = jest.fn();
		const cancel = requestReversibleIdleCallback(callback);
		expect(callback).not.toHaveBeenCalled();
		expect(cancelIdleCallback).not.toHaveBeenCalled();
		cancel();
		expect(cancelIdleCallback).toHaveBeenCalledTimes(1);
		idleCallback?.(fakeDeadline);
		expect(callback).not.toHaveBeenCalled();
	});
	test('cancel is idempotent', () => {
		const cancel = requestReversibleIdleCallback(jest.fn());
		cancel();
		cancel(); // second call should not throw
	});
});
