import { describe, test, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { requestReversibleAnimationFrame } from '..';

beforeAll(() => {
	vi.useFakeTimers();
});
afterAll(() => {
	vi.useRealTimers();
});
afterEach(() => {
	vi.resetAllMocks();
});

describe('requestReversibleAnimationFrame', () => {
	test('triggers', () => {
		const callback = vi.fn();
		vi.spyOn(window, 'requestAnimationFrame');
		requestReversibleAnimationFrame(callback);
		expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
		expect(requestAnimationFrame).toHaveBeenLastCalledWith(callback);
		expect(callback).not.toHaveBeenCalled();
		vi.runOnlyPendingTimers();
		expect(callback).toHaveBeenCalled();
		vi.runOnlyPendingTimers();
		vi.runOnlyPendingTimers();
		vi.runOnlyPendingTimers();
		expect(callback).toHaveBeenCalledTimes(1); // runs only once
	});
	test('cancels', () => {
		const callback = vi.fn();
		vi.spyOn(window, 'cancelAnimationFrame');
		const cancel = requestReversibleAnimationFrame(callback);
		expect(callback).not.toHaveBeenCalled();
		expect(cancelAnimationFrame).not.toHaveBeenCalled();
		cancel();
		expect(cancelAnimationFrame).toHaveBeenCalledTimes(1);
		vi.runOnlyPendingTimers();
		expect(callback).not.toHaveBeenCalled();
	});
	test('cancel is idempotent', () => {
		const cancel = requestReversibleAnimationFrame(vi.fn());
		cancel();
		cancel(); // second call should not throw
	});
});
