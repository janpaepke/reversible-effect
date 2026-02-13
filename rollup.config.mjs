import path from 'node:path';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';
import clean from 'rollup-plugin-delete';
import bundleSize from 'rollup-plugin-bundle-size';
import license from 'rollup-plugin-license';

import pkg from './package.json' with { type: 'json' };
import cfg from './tsconfig.json' with { type: 'json' };

export default [
	{
		input: './src/index.ts',
		output: [
			{
				format: 'umd',
				file: pkg.main,
				name: pkg.title, // var name of browser global
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
	// Bundle all .d.ts files into a single index.d.ts
	{
		input: pkg.types,
		output: { file: pkg.types, format: 'es' },
		plugins: [dts(), clean({ targets: [`${path.dirname(pkg.types)}/*.d.ts`, `!${pkg.types}`], hook: 'writeBundle' })],
	},
];
