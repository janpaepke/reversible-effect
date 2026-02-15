import { expectTypeOf } from 'vitest';
import { setReversibleTimeout } from '..';

expectTypeOf(setReversibleTimeout(() => void null)).toEqualTypeOf<() => void>();
