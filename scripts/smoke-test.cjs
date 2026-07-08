'use strict';

/**
 * Runtime smoke test for the published bundle on legacy Node versions that the
 * dev/test toolchain (vitest) can no longer run on. It exercises the built UMD
 * artifact via `require`, not the source, so it validates what consumers of the
 * package actually load. Kept DOM-free so it runs on bare Node.
 */

const assert = require('assert');
const path = require('path');

const bundlePath = path.resolve(__dirname, '..', 'dist', 'reversible.umd.js');
const lib = require(bundlePath);

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

// Give the cancelled timers a window in which they would have fired if not reversed.
setTimeout(() => {
	assert.strictEqual(timeoutFired, false, 'reversed timeout should not have fired');
	assert.strictEqual(intervalFired, false, 'reversed interval should not have fired');
	console.log(`smoke test passed on Node ${process.version}: bundle loads, exports intact, effects reverse`);
}, 50);
