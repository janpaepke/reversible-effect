import { describe, test, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { setReversibleInterval } from '..';

beforeAll(() => {
	vi.useFakeTimers();
});
afterAll(() => {
	vi.useRealTimers();
});
afterEach(() => {
	vi.resetAllMocks();
});

describe('setReversibleInterval', () => {
	test('triggers', () => {
		const callback = vi.fn();
		vi.spyOn(global, 'setInterval');
		setReversibleInterval(callback, 1000);
		expect(setInterval).toHaveBeenCalledTimes(1);
		expect(setInterval).toHaveBeenLastCalledWith(callback, 1000);
		expect(callback).not.toHaveBeenCalled();
		vi.runOnlyPendingTimers();
		expect(callback).toHaveBeenCalled();
		vi.runOnlyPendingTimers();
		vi.runOnlyPendingTimers();
		vi.runOnlyPendingTimers();
		expect(callback).toHaveBeenCalledTimes(4);
	});
	test('cancels', () => {
		const callback = vi.fn();
		vi.spyOn(global, 'clearInterval');
		const cancel = setReversibleInterval(callback, 1000);
		expect(callback).not.toHaveBeenCalled();
		expect(clearInterval).not.toHaveBeenCalled();
		cancel();
		expect(clearInterval).toHaveBeenCalledTimes(1);
		vi.runOnlyPendingTimers();
		expect(callback).not.toHaveBeenCalled();
	});
	test('cancel is idempotent', () => {
		const cancel = setReversibleInterval(vi.fn(), 1000);
		cancel();
		cancel(); // second call should not throw
	});
});
