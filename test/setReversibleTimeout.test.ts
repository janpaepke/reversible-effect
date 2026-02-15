import { describe, test, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { setReversibleTimeout } from '..';

beforeAll(() => {
	vi.useFakeTimers();
});
afterAll(() => {
	vi.useRealTimers();
});
afterEach(() => {
	vi.resetAllMocks();
});

describe('setReversibleTimeout', () => {
	test('triggers', () => {
		const callback = vi.fn();
		vi.spyOn(global, 'setTimeout');
		setReversibleTimeout(callback, 1000);
		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenLastCalledWith(callback, 1000);
		expect(callback).not.toHaveBeenCalled();
		vi.runAllTimers();
		expect(callback).toHaveBeenCalled();
		// shouldn't trigger again...
		vi.runAllTimers();
		vi.runAllTimers();
		vi.runAllTimers();
		expect(callback).toHaveBeenCalledTimes(1);
	});
	test('cancels', () => {
		const callback = vi.fn();
		vi.spyOn(global, 'clearTimeout');
		const cancel = setReversibleTimeout(callback, 1000);
		expect(callback).not.toHaveBeenCalled();
		expect(clearTimeout).not.toHaveBeenCalled();
		cancel();
		expect(clearTimeout).toHaveBeenCalledTimes(1);
		vi.runAllTimers();
		expect(callback).not.toHaveBeenCalled();
	});
	test('cancel is idempotent', () => {
		const cancel = setReversibleTimeout(vi.fn(), 1000);
		cancel();
		cancel(); // second call should not throw
	});
});
