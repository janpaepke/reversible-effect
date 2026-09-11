import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		root: '.',
		alias: {
			'..': fileURLToPath(new URL('./src', import.meta.url)),
		},
		typecheck: {
			include: ['test/**/*.test-d.ts'],
			// the root tsconfig only covers src — without its own config, tsc would never see the type tests
			tsconfig: './tsconfig.test.json',
		},
	},
});
