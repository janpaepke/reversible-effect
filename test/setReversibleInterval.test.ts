import { setReversibleInterval } from '..';

beforeAll(() => {
	jest.useFakeTimers();
});
afterAll(() => {
	jest.useRealTimers();
});
afterEach(() => {
	jest.resetAllMocks();
});

describe('setReversibleInterval', () => {
	test('triggers', () => {
		const callback = jest.fn();
		jest.spyOn(global, 'setInterval');
		setReversibleInterval(callback, 1000);
		expect(setInterval).toHaveBeenCalledTimes(1);
		expect(setInterval).toHaveBeenLastCalledWith(callback, 1000);
		expect(callback).not.toHaveBeenCalled();
		jest.runOnlyPendingTimers();
		expect(callback).toHaveBeenCalled();
		jest.runOnlyPendingTimers();
		jest.runOnlyPendingTimers();
		jest.runOnlyPendingTimers();
		expect(callback).toHaveBeenCalledTimes(4);
	});
	test('cancels', () => {
		const callback = jest.fn();
		jest.spyOn(global, 'clearInterval');
		const cancel = setReversibleInterval(callback, 1000);
		expect(callback).not.toHaveBeenCalled();
		expect(clearInterval).not.toHaveBeenCalled();
		cancel();
		expect(clearInterval).toHaveBeenCalledTimes(1);
		jest.runOnlyPendingTimers();
		expect(callback).not.toHaveBeenCalled();
	});
	test('cancel is idempotent', () => {
		const cancel = setReversibleInterval(jest.fn(), 1000);
		cancel();
		cancel(); // second call should not throw
	});
});
