import { expectTypeOf } from 'vitest';
import { requestReversibleAnimationFrame } from '..';

expectTypeOf(requestReversibleAnimationFrame(() => void null)).toEqualTypeOf<() => void>();

const inferParam = <T>(fun: (cb: T) => () => void) => void fun as unknown as T;
expectTypeOf(inferParam(requestReversibleAnimationFrame)).toEqualTypeOf<(time: DOMHighResTimeStamp) => void>();
