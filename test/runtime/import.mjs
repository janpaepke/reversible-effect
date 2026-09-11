/**
 * Runtime test for the published package, loaded via ESM named imports as Node ESM consumers do. Named imports
 * fail at link time when Node cannot see an export, so loading this module is itself the first check.
 */

import {
	addReversibleEventListener,
	requestReversibleAnimationFrame,
	requestReversibleIdleCallback,
	setReversibleInterval,
	setReversibleTimeout,
} from 'reversible-effect';

import runRuntimeChecks from './checks.cjs';

runRuntimeChecks(
	{
		addReversibleEventListener,
		requestReversibleAnimationFrame,
		requestReversibleIdleCallback,
		setReversibleInterval,
		setReversibleTimeout,
	},
	'import'
);
