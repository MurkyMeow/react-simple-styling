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

## Theming

Now the library supports string interpolation. You can use it to manage themes easily.

```js
const style = css`
  .border {
    border: 1px solid ${theme.accent}
  }
`;

```

## CSS syntax highlighting

To bring syntax highlighting and autocomplete checkout the extenstions for [styled-jsx][styledjsx] which work with my module as well.

https://github.com/zeit/styled-jsx#syntax-highlighting

![](https://i.imgur.com/2Cmow8E.png)

## Thanks to

- [Joshua Robinson][buildbreakdo]. Most of the code for css scoping i took from his [style-it][style-it] module.

[buildbreakdo]: https://github.com/buildbreakdo/
[style-it]: https://github.com/buildbreakdo/style-it
[styledjsx]: https://github.com/zeit/styled-jsx