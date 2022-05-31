import { setReversibleTimeout } from '..';

beforeAll(() => {
	jest.useFakeTimers();
});
afterAll(() => {
	jest.useRealTimers();
});
afterEach(() => {
	jest.resetAllMocks();
});

describe('setReversibleTimeout', () => {
	test('triggers', () => {
		const callback = jest.fn();
		jest.spyOn(global, 'setTimeout');
		setReversibleTimeout(callback, 1000);
		expect(setTimeout).toHaveBeenCalledTimes(1);
		expect(setTimeout).toHaveBeenLastCalledWith(callback, 1000);
		expect(callback).not.toHaveBeenCalled();
		jest.runAllTimers();
		expect(callback).toHaveBeenCalled();
		// shouldn't trigger again...
		jest.runAllTimers();
		jest.runAllTimers();
		jest.runAllTimers();
		expect(callback).toHaveBeenCalledTimes(1);
	});
	test('cancels', () => {
		const callback = jest.fn();
		jest.spyOn(global, 'clearTimeout');
		const cancel = setReversibleTimeout(callback, 1000);
		expect(callback).not.toHaveBeenCalled();
		expect(clearTimeout).not.toHaveBeenCalled();
		cancel();
		expect(clearTimeout).toHaveBeenCalledTimes(1);
		jest.runAllTimers();
		expect(callback).not.toHaveBeenCalled();
	});
});
