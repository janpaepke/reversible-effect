import path from 'path';

import typescript from '@rollup/plugin-typescript';
import bundleSize from 'rollup-plugin-bundle-size';
import license from 'rollup-plugin-license';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const inputFile = './src/index.ts';
const bannerFile = './banner.txt';

const umdOutput = {
	format: 'umd',
	file: pkg.main,
	name: pkg.title, // var name of browser global
};

const esmOutput = {
	format: 'esm',
	file: pkg.module,
};

const tsPluginConfig = {
	tsconfig: './tsconfig.json',
	declarationDir: '', // otherwise goes to subfolder of output
};

const minificationConfig = {
	compress: {
		unsafe: true,
	},
	format: {
		comments: false,
	},
};

const licenseConfig = {
	banner: {
		commentStyle: 'ignored',
		content: {
			file: path.join(__dirname, bannerFile),
			encoding: 'utf-8',
		},
	},
};

export default [
	{
		input: inputFile,
		output: [umdOutput, esmOutput],
		plugins: [bundleSize(), typescript(tsPluginConfig), terser(minificationConfig), license(licenseConfig)],
	},
];
