import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import clean from 'rollup-plugin-delete';
import bundleSize from 'rollup-plugin-bundle-size';
import license from 'rollup-plugin-license';

import pkg from './package.json' with { type: 'json' };
import cfg from './tsconfig.json' with { type: 'json' };

/*
 * Node picks the entry point through `exports`, which serves ESM importers the `.mjs` build (Node cannot see the named
 * exports of the UMD build) with `.d.mts` declarations. `main`, `module` and `types` point to the same files for tools
 * without `exports`.
 */
const esmEntry = pkg.exports['.'].import;
const input = './src/index.ts';

export default [
	{
		input,
		output: [
			{
				format: 'umd',
				file: pkg.main,
				name: pkg.name.replace(/-(\w)/g, (_, letter) => letter.toUpperCase()), // browser global: reversibleEffect
			},
			{
				format: 'esm',
				file: pkg.module,
			},
		],
		plugins: [
			clean({
				targets: `${cfg.compilerOptions.outDir}/*`,
			}),
			bundleSize(),
			typescript(),
			terser(),
			license({
				banner: {
					commentStyle: 'ignored',
					content: {
						file: './banner.txt',
						encoding: 'utf-8',
					},
				},
			}),
		],
	},
	/*
	 * Generate the declarations from source, bundled into one file per entry point and named after the bundle it
	 * describes (as TypeScript pairs them): TypeScript takes the module format of a declaration file from its extension,
	 * so each entry needs its own.
	 */
	{
		input,
		output: [
			{ file: pkg.types, format: 'es' },
			{ file: esmEntry.types, format: 'es' },
		],
		plugins: [dts()],
	},
];
