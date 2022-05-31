import { expectType } from 'tsd';

/**
 * type tests
 */
import { setReversibleTimeout } from '..';

expectType<() => void>(setReversibleTimeout(() => void null));
