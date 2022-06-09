/**
 * @jest-environment jsdom
 */

import { requestReversibleAnimationFrame } from '..';

beforeAll(() => {
	jest.useFakeTimers();
});
afterAll(() => {
	jest.useRealTimers();
});
afterEach(() => {
	jest.resetAllMocks();
});

describe('requestReversibleAnimationFrame', () => {
	test('triggers', () => {
		const callback = jest.fn();
		jest.spyOn(window, 'requestAnimationFrame');
		requestReversibleAnimationFrame(callback);
		expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
		expect(requestAnimationFrame).toHaveBeenLastCalledWith(callback);
		expect(callback).not.toHaveBeenCalled();
		jest.runOnlyPendingTimers();
		expect(callback).toHaveBeenCalled();
		jest.runOnlyPendingTimers();
		jest.runOnlyPendingTimers();
		jest.runOnlyPendingTimers();
		expect(callback).toHaveBeenCalledTimes(1); // runs only once
	});
	test('cancels', () => {
		const callback = jest.fn();
		jest.spyOn(window, 'cancelAnimationFrame');
		const cancel = requestReversibleAnimationFrame(callback);
		expect(callback).not.toHaveBeenCalled();
		expect(cancelAnimationFrame).not.toHaveBeenCalled();
		cancel();
		expect(cancelAnimationFrame).toHaveBeenCalledTimes(1);
		jest.runOnlyPendingTimers();
		expect(callback).not.toHaveBeenCalled();
	});
});
