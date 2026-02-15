import { expectTypeOf } from 'vitest';
import { requestReversibleIdleCallback } from '..';

expectTypeOf(requestReversibleIdleCallback(() => void null)).toEqualTypeOf<() => void>();
expectTypeOf(requestReversibleIdleCallback(() => void null, { timeout: 1000 })).toEqualTypeOf<() => void>();

const inferParam = <T>(fun: (cb: T) => () => void) => void fun as unknown as T;
expectTypeOf(inferParam(requestReversibleIdleCallback)).toEqualTypeOf<IdleRequestCallback>();
