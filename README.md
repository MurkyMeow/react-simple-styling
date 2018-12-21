# React simple styling

Very simple Vue-like library to create scoped styles for your React components!

```console
npm i react-simple-styling
```

## Usage

import

```js
import { styleable, styled, css } from 'react-simple-styling'
```

Write normal CSS.

```js
const scope = css`
  .message {
    width: 300px;
    margin: 0 auto;
    color: red;
  }
;`
```

Use normal class names.
```js
const App = ()=> (
  <div>
    <div className="message">
      Hello world!
    </div>
  </div>
);
```

**styled** wrapper will apply the styles and add scoping to them!

```js
export default styled(App, scope);
```

## Consuming className

Want to pass some class names to the component from it's parent?
No more extracting and applying className manually!

```js
const Card = ({children})=> (
  <div className="card-bg rounded p-2">
    {children}
  </div>
);
```

**styleable** wrapper will take care of it!
```js
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

## :host

To style your component's root element you can use **:host** pseudo class just like in Shadow DOM:

```js
const scope = css`
  :host {
    position: fixed;
    bottom: 0;
    left: 0;
  }
`;

const BottomNavigation = ()=> (
  <Flex justify="around"> {/*<-- style is applied to this element*/}
    <LinkButton to="/calendar"/>
    <LinkButton to="/explore"/>
    <LinkButton to="/notifications"/>
    <LinkButton to="/profile"/>
  </Flex>
);

export default styled(BottomNavigation, scope);
```

## What about Fragment?

Fragment component's children doesn't have parent so scope is applied to all of them:

```js
const scope = css`
  .test {
    color: red;
  }
`;

const Foo = styled(()=> (
  <>
    <p className="test">bar</p>
    <p>baz</p>
    <>
      <p>qux</p>
    </>
  </>
), scope);

//<Foo/> will be rendered as shown below:

<p class="-vg6oqh test">bar</p>
<p class="-vg6oqh">baz</p>
<p class="-vg6oqh">qux</p>
```

## CSS syntax highlighting

Don't worry about coding experience when using string literals. With some magic of extensions you can bring CSS syntax highlighting and popus into your js.

For VSCode i prefer this ones:

https://marketplace.visualstudio.com/items?itemName=AndrewRazumovsky.vscode-styled-jsx-languageserver

https://marketplace.visualstudio.com/items?itemName=blanu.vscode-styled-jsx

![](https://i.imgur.com/vMFU4sJ.png)
