import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
	test: {
		environment: 'jsdom',
		root: '.',
		alias: {
			'..': path.resolve(__dirname, 'src'),
		},
		typecheck: {
			include: ['test/**/*.test-d.ts'],
		},
	},
});
