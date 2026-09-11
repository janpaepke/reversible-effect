import { expectTypeOf, test } from 'vitest';
import { setReversibleInterval } from '..';

test('setReversibleInterval returns a reverse callback', () => {
	expectTypeOf(setReversibleInterval(() => void null)).toEqualTypeOf<() => void>();
});
