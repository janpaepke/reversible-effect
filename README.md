# reversible effect ↩️

**A collection of functions returning a callback to reverse their effect.**

Tired of writing this?

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

How about you write this instead and get the same result?

```ts
useEffect(
	() =>
		reversibleEventListener(window, 'resize', () => {
			console.log('window resized');
		}),
	[]
);
```

See below to learn more.

## Content

<!-- codegen:start {preset: markdownTOC, minDepth: 2, maxDepth: 4} -->

-   [Content](#content)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Documentation](#documentation)
    -   [addEventListener](#addeventlistener)
    -   [setTimeout](#settimeout)
    -   [setInterval](#setinterval)
-   [Contributing](#contributing)
<!-- codegen:end -->

## Installation

using npm:

```sh
npm install reversible-effect
```

using yarn:

```sh
yarn add reversible-effect
```

## Usage

Import the required function as a named export from the package.  
See [Documentation](#documentation) for available functions.

```ts
import { reversibleFunctionName } from 'reversible-effect'; // this is an example, there is no 'reversibleFunctionName'
```

## Documentation

Side effects like `addEventListener` can be reversed with a

### addEventListener

### setTimeout

### setInterval

## Contributing

##
