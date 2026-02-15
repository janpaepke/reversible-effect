import { describe, test, expect, beforeAll, afterEach, vi } from 'vitest';
import { requestReversibleIdleCallback } from '..';

// jsdom doesn't support requestIdleCallback, so we mock it
let idleHandle = 0;
let idleCallback: IdleRequestCallback | null = null;

beforeAll(() => {
	window.requestIdleCallback = vi.fn((cb: IdleRequestCallback) => {
		idleCallback = cb;
		return ++idleHandle;
	});
	window.cancelIdleCallback = vi.fn(() => {
		idleCallback = null;
	});
});
afterEach(() => {
	vi.resetAllMocks();
	idleCallback = null;
});

const fakeDeadline: IdleDeadline = {
	didTimeout: false,
	timeRemaining: () => 50,
};

describe('requestReversibleIdleCallback', () => {
	test('triggers', () => {
		const callback = vi.fn();
		requestReversibleIdleCallback(callback);
		expect(requestIdleCallback).toHaveBeenCalledTimes(1);
		expect(requestIdleCallback).toHaveBeenLastCalledWith(callback);
		expect(callback).not.toHaveBeenCalled();
		idleCallback?.(fakeDeadline);
		expect(callback).toHaveBeenCalledTimes(1);
	});
	test('passes options', () => {
		const callback = vi.fn();
		requestReversibleIdleCallback(callback, { timeout: 1000 });
		expect(requestIdleCallback).toHaveBeenCalledWith(callback, { timeout: 1000 });
	});
	test('cancels', () => {
		const callback = vi.fn();
		const cancel = requestReversibleIdleCallback(callback);
		expect(callback).not.toHaveBeenCalled();
		expect(cancelIdleCallback).not.toHaveBeenCalled();
		cancel();
		expect(cancelIdleCallback).toHaveBeenCalledTimes(1);
		idleCallback?.(fakeDeadline);
		expect(callback).not.toHaveBeenCalled();
	});
	test('cancel is idempotent', () => {
		const cancel = requestReversibleIdleCallback(vi.fn());
		cancel();
		cancel(); // second call should not throw
	});
});
