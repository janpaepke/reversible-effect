# reversible effect ↩️

<h3>Cleanup Utilities for JavaScript Side-Effects</h3>

**A zero dependency collection of typed utility functions returning a callback to reverse their effect.**

[<img alt="current version" src="https://badgen.net/npm/v/reversible-effect" />](https://www.npmjs.com/package/reversible-effect)
[<img alt="no dependencies" src="https://badgen.net/bundlephobia/dependency-count/reversible-effect?label=dependencies&color=green" />](https://bundlephobia.com/package/reversible-effect)
[<img alt="tree shaking support" src="https://badgen.net/bundlephobia/tree-shaking/reversible-effect" />](https://bundlephobia.com/package/reversible-effect)
[<img alt="tests" src="https://badgen.net/github/checks/janpaepke/reversible-effect" />](https://github.com/janpaepke/reversible-effect/actions)
[<img alt="types included" src="https://badgen.net/npm/types/reversible-effect" />](https://www.npmjs.com/package/reversible-effect)
[<img alt="MIT license" src="https://badgen.net/npm/license/reversible-effect" />](./LICENSE.md)
[<img alt="gzip bundle size" src="https://badgen.net/bundlephobia/minzip/reversible-effect?label=size" />](https://bundlephobia.com/package/reversible-effect)

This package includes reversible implementations of:

- [setTimeout](#setreversibletimeout)
- [setInterval](#setreversibleinterval)
- [addEventListener](#addreversibleeventlistener)
- [requestAnimationFrame](#requestreversibleanimationframe)

<hr />

Hey you! Yes, **you**!  
Are you tired of writing this?

```ts
useEffect(() => {
	const myCallback = () => {
		console.log('window resized');
	};
	window.addEventListener('resize', myCallback);
	return () => {
		window.removeEventListener('resize', myCallback);
	};
}, []);
```

How about writing this instead?

<!-- prettier-ignore-start -->
```ts
useEffect(
    () => addReversibleEventListener(window, 'resize', () => {
        console.log('window resized');
    }), []
);
```
<!-- prettier-ignore-end -->

Let's find out [how](#documentation) or [why](#motivation).

<hr />

<h2>Content</h2>

<!-- prettier-ignore-start -->

<!-- toc -->

- [Installation](#installation)
- [Motivation](#motivation)
- [Documentation](#documentation)
  - [Basic Usage](#basic-usage)
  - [React's `useEffect`](#reacts-useeffect)
  - [Available functions](#available-functions)
    - [`addReversibleEventListener`](#addreversibleeventlistener)
    - [`setReversibleTimeout`](#setreversibletimeout)
    - [`setReversibleInterval`](#setreversibleinterval)
    - [`requestReversibleAnimationFrame`](#requestreversibleanimationframe)
- [Contributing](#contributing)
- [Support](#support)

<!-- tocstop -->

<!-- prettier-ignore-end -->

## Installation

using npm:

```sh
npm install reversible-effect
```

using yarn:

```sh
yarn add reversible-effect
```

Just import the required function from the package, here's an example for `addReversibleEventListener`:

```ts
import { addReversibleEventListener } from 'reversible-effect';
```

See [below](#documentation) for available functions and how to use them.

## Motivation

For a detailed explanation, check out [this Medium article](https://medium.com/@janpaepke/clean-up-after-yourself-e0eaa283e641), but here's the gist of it:

Functions like `setTimeout` or `addEventListener` come with an accompanying function to reverse their effect, like `clearTimeout` or `removeEventListener`.

To be able to use them, you need to keep track of which effect you're trying to reverse, so you can call the appropriate function. To make matters worse, these functions require different parameters.

You also need to keep track of all references to identify what it is you want to cancel (a `timeoutId` for `clearTimeOut` or the `eventName` as well as the `callback` for `removeEventListener`).

This package and the functions it provides aim to improve this:

- **Unify the interface**:  
  Doesn't matter what type of effect – just call function to reverse it.
- **Simplify the implementation**:  
  No need to keep track of timeout IDs or callback references.
- **Provide type security**:  
  When using typescript the respective function parameters should mirror the behaviour of their originals.

## Documentation

### Basic Usage

Every function in this package returns a callback, which serves as its cleanup.

This allows you to do this:

```ts
// create an interval
const cancelInterval = setReversibleInterval(() => console.log('called'), 1000);
// cancel it
cancelInterval();
```

Note that you don't have to keep track of a `timeoutID`, you can pass around a reference to the cleanup function to wherever you need it.  
You can then call it without needing to know that it is an interval you're cancelling.  
It would work just the same for an event:

```ts
// add an event listener
const remove = addReversibleEventListener(window, 'click', () => console.log('clicked'));
// remove it
remove();
```

### React's `useEffect`

A common use case of these functions is within a react's `useEffect` hook, which conveniently expects you to return function to reverse the effect.  
As every function returns its own cleanup, you can return the reversible function from the hook directly.

This example will add the event listener, whenever the component mounts and remove it, when it unmounts:

```ts
useEffect(() => addReversibleEventListener(window, 'click', e => console.log(e.clientX, e.clientY)), []);
```

Here we start an interval, when the component mounts and stop it, when it unmounts:

```ts
useEffect(() => setReversibleInterval(() => setCount(count => count + 1), 500), []);
```

**Note**: If you add dependencies to the `useEffect` hook here, the timer will reset any time a dependency changes.  
See [here](https://overreacted.io/making-setinterval-declarative-with-react-hooks/) to learn why and how to get around this.

If you have multiple effects, you could either define multiple `useEffect` hooks or use them like this:

```ts
useEffect(() => {
	const cancelTimeout = setReversibleTimeout(() => {}, 1000);
	const removeEventListener = addEventListener(window, 'click', () => {});
	return () => {
		cancelTimeout();
		removeEventListener();
	};
}, []);
```

### Available functions

#### `addReversibleEventListener`

Reversible version of `object.addEventListener`. [→ docs for original](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)

This function has two overloads, which switch based on the provided `target`. If `target` is an object we know the supported event types for, typescript will both limit `type` to supported types and provide the correct event type to the `callback`.

```ts
function addReversibleEventListener(
	target: EventTargetWithKnownEvents,
	type: AvailableEventsForThisTarget, // string literal of available event listeners
	listener: (e: SpecificEvent) => void, // Callback with Specific Event based on type
	options?: boolean | AddEventListenerOptions
): () => void;
```

If we can't determine the event type, it will fall back to a generic version:

```ts
function addReversibleEventListener(
	target: GenericTarget,
	type: string,
	listener: (e: Event) => void,
	options?: boolean | AddEventListenerOptions
): () => void;
```

Note that there is shared behaviour with `addEventListener`/`removeEventListener` when called with the same arguments:

1. When adding the same listener multiple times, it will not be added more than once.
2. A returned cleanup can cancel any listener that was added using the same arguments.

See below examples for details:

```ts
const callback = () => console.log('hello');
const cancel1 = addReversibleEventListener('click', callback);
cancel1();
const cancel2 = addReversibleEventListener('click', callback);
const cancel3 = addReversibleEventListener('click', callback);
//              ⬆ Since the passed arguments are the same, the callback will only be called once, when the event is fired.
cancel1();
// ⬆ Even though it has been used before this will remove the listener. It is functionally equivalent to `cancel2` and `cancel3`.
```

If you specifically want to add a listener multiple times or make sure a cleanup function only concerns the listener it created, the solution is the same as with the originals – make the callback is referentially unique:

```ts
const cancel1 = addReversibleEventListener('click', e => callback(e));
const cancel2 = addReversibleEventListener('click', e => callback(e));
//              ⬆ The passed parameter is referentially unique, so the callback is executed twice, when the event is fired.
cancel1();
// ⬆ This will only ever remove the first listener, the second still fires, until `cancel2()` is called.
```

#### `setReversibleTimeout`

Reversible version of `[window.]setTimeout`. [→ docs for original](https://developer.mozilla.org/docs/Web/API/setTimeout)

```ts
function setReversibleTimeout(
	callback: (...args: any[]) => void, // function to be executed after `delay`
	delay?: number = 0, // delay for timeout
	...args: any[] // optional args to be passed into `callback`
): () => void;
```

#### `setReversibleInterval`

Reversible version of `[window.]setInterval`. [→ docs for original](https://developer.mozilla.org/docs/Web/API/setInterval)

```ts
function setReversibleInterval(
	callback: (...args: any[]) => void, // function to be executed every `delay`
	delay?: number = 0, // delay between executions
	...args: any[] // optional args to be passed into `callback`
): () => void;
```

#### `requestReversibleAnimationFrame`

Reversible version of `window.requestAnimationFrame`. [→ docs for original](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

```ts
function requestReversibleAnimationFrame(
	callback: (time: DOMHighResTimeStamp): void; // function to be executed on next repaint
): () => void;
```

## Contributing

Improvements or additions are most welcome!

Current list of planned support:

- [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)
- [setImmediate](https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate)

This package uses `npm` as its package manager.

Fork / Clone the repo, run `npm install`, then `npm start` to build in watch mode.

Run `npm run test:watch` to run the tests, don't forget to add new tests, if you add functionality.

Create a PR, describing your change.

## Support

Found a bug or need help? [Add a new issue](https://github.com/janpaepke/reversible-effect/issues).
