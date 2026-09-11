'use strict';

const assert = require('assert');

/**
 * Runtime checks shared by the runtime tests: every export is present and callable, and the returned callbacks actually
 * reverse their effect. Kept DOM-free so they run on bare Node.
 * @param {Record<string, unknown>} lib - the package's exports, however they were loaded
 * @param {string} loader - how the package was loaded, for the success message
 */
function runRuntimeChecks(lib, loader) {
	// All named exports are present and callable.
	const expectedExports = [
		'setReversibleTimeout',
		'setReversibleInterval',
		'addReversibleEventListener',
		'requestReversibleAnimationFrame',
		'requestReversibleIdleCallback',
	];
	for (const name of expectedExports) {
		assert.strictEqual(typeof lib[name], 'function', `missing export: ${name}`);
	}

	// setReversibleTimeout: the returned callback actually cancels the effect.
	let timeoutFired = false;
	const cancelTimeout = lib.setReversibleTimeout(() => {
		timeoutFired = true;
	}, 10);
	assert.strictEqual(typeof cancelTimeout, 'function', 'setReversibleTimeout did not return a reverse callback');
	cancelTimeout();

	// setReversibleInterval: same contract, using node-native timers.
	let intervalFired = false;
	const cancelInterval = lib.setReversibleInterval(() => {
		intervalFired = true;
	}, 10);
	assert.strictEqual(typeof cancelInterval, 'function', 'setReversibleInterval did not return a reverse callback');
	cancelInterval();

	// addReversibleEventListener: the generic overload takes any event target — here Node's own.
	const target = new EventTarget();
	let events = 0;
	const removeListener = lib.addReversibleEventListener(target, 'ping', () => {
		events++;
	});
	assert.strictEqual(typeof removeListener, 'function', 'addReversibleEventListener did not return a reverse callback');
	target.dispatchEvent(new Event('ping'));
	assert.strictEqual(events, 1, 'listener did not receive the event');
	removeListener();
	target.dispatchEvent(new Event('ping'));
	assert.strictEqual(events, 1, 'reversed listener should not have received the event');

	// Give the cancelled timers a window in which they would have fired if not reversed.
	setTimeout(() => {
		assert.strictEqual(timeoutFired, false, 'reversed timeout should not have fired');
		assert.strictEqual(intervalFired, false, 'reversed interval should not have fired');
		console.log(
			`runtime test (${loader}) passed on Node ${process.version}: package loads, exports intact, effects reverse`
		);
	}, 50);
}

module.exports = runRuntimeChecks;
