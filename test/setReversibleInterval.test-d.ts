import { expectTypeOf } from 'vitest';
import { setReversibleInterval } from '..';

expectTypeOf(setReversibleInterval(() => void null)).toEqualTypeOf<() => void>();
