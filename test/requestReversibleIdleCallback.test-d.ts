import { expectTypeOf, test } from 'vitest';
import { requestReversibleIdleCallback } from '..';

const inferParam = <T>(fun: (cb: T) => () => void) => void fun as unknown as T;

test('requestReversibleIdleCallback mirrors requestIdleCallback', () => {
	expectTypeOf(requestReversibleIdleCallback(() => void null)).toEqualTypeOf<() => void>();
	expectTypeOf(requestReversibleIdleCallback(() => void null, { timeout: 1000 })).toEqualTypeOf<() => void>();
	expectTypeOf(inferParam(requestReversibleIdleCallback)).toEqualTypeOf<IdleRequestCallback>();
});
