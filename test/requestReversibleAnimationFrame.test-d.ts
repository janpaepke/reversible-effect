import { expectType } from 'tsd';

/**
 * type tests
 */
import { requestReversibleAnimationFrame } from '..';

expectType<() => void>(requestReversibleAnimationFrame(() => void null));

const inferParam = <T>(fun: (cb: T) => () => void) => void fun as unknown as T;
expectType<(time: DOMHighResTimeStamp) => void>(inferParam(requestReversibleAnimationFrame));
