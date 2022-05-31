import { expectType } from 'tsd';

/**
 * type tests
 */
import { setReversibleInterval } from '..';

expectType<() => void>(setReversibleInterval(() => void null));
