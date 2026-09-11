// @vitest-environment node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';

const root = fileURLToPath(new URL('..', import.meta.url));

test('generated event maps match the installed TypeScript version', async () => {
	const { generate } = await import(resolve(root, 'scripts/generate-event-maps.mjs'));
	const files: Record<string, string> = await generate();
	for (const [file, content] of Object.entries(files)) {
		expect(readFileSync(resolve(root, file), 'utf8'), `${file} is outdated — run \`npm run generate:event-maps\``).toBe(
			content
		);
	}
});
