import { expectType } from 'tsd';

/**
 * type tests
 */
import { addReversibleEventListener } from '..';

expectType<(options?: boolean | EventListenerOptions) => void>(
	addReversibleEventListener(window, 'click', () => void null)
);
