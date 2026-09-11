import { rmSync } from 'node:fs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
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

/** Empties the output directory before a build; rollup only replaces the files it writes itself. */
const cleanOutput = {
	name: 'clean-output',
	buildStart: () => rmSync(cfg.compilerOptions.outDir, { force: true, recursive: true }),
};

export default [
	{
		input,
		output: [
			{
				format: 'umd',
				file: pkg.main,
				name: pkg.name.replace(/-(\w)/g, (_, letter) => letter.toUpperCase()), // browser global: reversibleEffect
				sourcemap: true,
				// minified for browsers loading it as-is; the ESM build stays readable, as bundlers minify it themselves
				plugins: [terser()],
			},
			{
				format: 'esm',
				file: pkg.module,
				sourcemap: true,
			},
		],
		plugins: [
			cleanOutput,
			bundleSize(),
			typescript(),
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
		// isolatedDeclarations keeps the public API's types explicit, so the declarations never depend on inference
		plugins: [dts({ compilerOptions: { isolatedDeclarations: true } })],
	},
];
