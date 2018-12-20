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

<!-- ## How does it work?

The core concept is extremely simple. **css** function generates the unique string which is applied to all the selectors of the style so this:
```css
.message {
  width: 300px;
  margin: 0 auto;
  color: red;
}
```

becomes something like this:
```css
.kzsbuayyd,
.kzsbuayyd .message {
  width: 300px;
  margin: 0 auto;
  color: red;
}
```

It makes "message" class only available for those elements which parent has "kzsbuayyd" class and for the parent itself. So the final step is to inject "kzsbuayyd" into the classList of root node of current component whish is what **styled** function is doing and boom -- style is applied and isolated from other component's styles. Unfortunately it doesn't work for global ones so keep it in mind.
 -->
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

There's a cool trick to style your component's root element. For example, you can use **:host** pseudo class just like in Shadow DOM:

```js
const scope = css`
  :host {
    position: fixed;
    bottom: 0;
    left: 0;
  }
`;

const BottomNavigation = ()=> (
  <Flex justify="around">
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
    <p>bar</p>
    <p>baz</p>
  </>
), scope);

//<Foo/> will be rendered this way:

<p class="test">bar</p>
<p class="test">baz</p>
```

## Robust approach

To be more explicit about grabbing className from props and injecting scope i have a bit different implementation. It is based on **useClasses** function.

```js
export default function Card({children}) {
  const classes = useClasses(arguments, 'card-bg rounded p-2');
  return (
    <div className={classes}>
      {children}
    </div>
  );
}
```

It takes *arguments* keyword as the first parameter so the function can extract className from props and return it. Besides, you can provide the rest of root node's classes to avoid concatenation.

[classnames]: https://www.npmjs.com/package/classnames

Scope also needs to be passed in if there's one. Children's classes stay as usual.
```js
const scope = css`
  .card {
    width: 300px;
    margin: 0 auto;
    text-align: center;
  }
`;

export default function App() {
  const classes = useClasses(arguments, scope);
  return (
    <div className={classes}>
      <Card className="card">
        Hello world!
      </Card>
    </div>
  );
}
```

It relies on [classnames] so arrays and conditionals are supported =).

```js
const classes = useClasses(arguments, 'foo', ['bar'], { baz: true })
```

With this approach you can't use arrow functions since they don't support *arguments* keyword, but it makes the code easier to read and fits nicely with React Hooks update.

## CSS syntax highlighting

Don't worry about coding experience when using string literals. With some magic of extensions you can bring CSS syntax highlighting and popus into your js.

For VSCode i prefer this ones:

https://marketplace.visualstudio.com/items?itemName=AndrewRazumovsky.vscode-styled-jsx-languageserver

https://marketplace.visualstudio.com/items?itemName=blanu.vscode-styled-jsx

![](https://i.imgur.com/vMFU4sJ.png)