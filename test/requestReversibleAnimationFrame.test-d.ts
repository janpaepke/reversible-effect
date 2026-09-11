import { expectTypeOf, test } from 'vitest';
import { requestReversibleAnimationFrame } from '..';

const inferParam = <T>(fun: (cb: T) => () => void) => void fun as unknown as T;

test('requestReversibleAnimationFrame mirrors requestAnimationFrame', () => {
	expectTypeOf(requestReversibleAnimationFrame(() => void null)).toEqualTypeOf<() => void>();
	expectTypeOf(inferParam(requestReversibleAnimationFrame)).toEqualTypeOf<(time: DOMHighResTimeStamp) => void>();
});
