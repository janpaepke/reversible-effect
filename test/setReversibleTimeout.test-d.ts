import { expectTypeOf, test } from 'vitest';
import { setReversibleTimeout } from '..';

test('setReversibleTimeout returns a reverse callback', () => {
	expectTypeOf(setReversibleTimeout(() => void null)).toEqualTypeOf<() => void>();
});
