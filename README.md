# React simple styling

Simple Vue-like library to create scoped styles for your React components!

[![NPM](https://nodei.co/npm/react-simple-styling.png)](https://npmjs.org/package/react-simple-styling)

## Installation

```sh
npm i react-simple-styling
```
or
```sh
yarn add react-simple-styling
```

## Usage

import

```js
import { css, styleable } from 'react-simple-styling'
```

Get a style wrapper

```js
const style = css`
  .message {
    width: 300px;
    margin: 0 auto;
    color: red;
  }
`;
```

and apply the css with it

```js
const App = ()=> style(
  <div>
    <div className="message">
      Hello world!
    </div>
  </div>
);
```

## Consuming className

No more manual extracting and applying className from props! **styleable** wrapper allows a component to consume className automatically:

```js
const Card = ({children})=> (
  <div className="card-bg rounded p-2">
    {children}
  </div>
);

export default styleable(Card);
```

And the code below

```js
const App = ()=> (
  <div>
    <Card className="test">
      Hello world!
    </Card>
  </div>
);
```

will be transformed into this:

```html
<div>
  <div class="card-bg rounded p-2 test">
    Hello world!
  </div>
</div>
```

## CSS syntax highlighting

Don't worry about coding experience when using string literals. With some magic of extensions you can bring CSS syntax highlighting and popus into your js.

For VSCode i prefer this ones:

https://marketplace.visualstudio.com/items?itemName=AndrewRazumovsky.vscode-styled-jsx-languageserver

https://marketplace.visualstudio.com/items?itemName=blanu.vscode-styled-jsx

![](https://i.imgur.com/2Cmow8E.png)

## Thanks to

- [Joshua Robinson][buildbreakdo]. Most of the code for css scoping i took from his [style-it][style-it] module.

[buildbreakdo]: https://github.com/buildbreakdo/
[style-it]: https://github.com/buildbreakdo/style-it