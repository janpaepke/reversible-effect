import terser from '@rollup/plugin-terser';
import clean from 'rollup-plugin-delete';
import fileSize from 'rollup-plugin-filesize';
import license from 'rollup-plugin-license';
import ts from 'rollup-plugin-ts';

import pkg from './package.json' assert { type: 'json' };
import cfg from './tsconfig.json' assert { type: 'json' };

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
			fileSize({
				showMinifiedSize: false,
			}),
			ts({
				hook: {
					outputPath: (path, kind) => (kind === 'declaration' ? pkg.types : path), // only one single type declaration file, instead of one per output file
				},
			}),
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
];
