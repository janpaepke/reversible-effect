import { expectType } from 'tsd';

/**
 * type tests
 */
import { requestReversibleIdleCallback } from '..';

expectType<() => void>(requestReversibleIdleCallback(() => void null));
expectType<() => void>(requestReversibleIdleCallback(() => void null, { timeout: 1000 }));

const inferParam = <T>(fun: (cb: T) => () => void) => void fun as unknown as T;
expectType<IdleRequestCallback>(inferParam(requestReversibleIdleCallback));
