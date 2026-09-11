'use strict';

/**
 * Runtime test for the published package, loaded via `require` as CommonJS consumers do. The package is
 * resolved by name (self-reference through `exports`), so this validates the built entry point consumers actually get,
 * not the source. Also runs on legacy Node versions the dev/test toolchain (vitest) can no longer run on.
 */

const runRuntimeChecks = require('./checks.cjs');

runRuntimeChecks(require('reversible-effect'), 'require');
