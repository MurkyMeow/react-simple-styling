# React simple styling

Write normal CSS.

```js
const prefix = css`
  .message {
    width: 300px;
    margin: 0 auto;
    color: red;
  }
;
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

"styled" wrapper will apply the styles and add scoping to them!

```js
export default styled(prefix)(App);
```

## How does it work?

Exremely simple! "css" function generates the unique string which is applied to all selectors of the style so this:
```css
.message {
  width: 300px;
  margin: 0 auto;
  color: red;
}
```

becomes something like this:
```css
.kzsbuayyd .message {
  width: 300px;
  margin: 0 auto;
  color: red;
}
```

It makes "message" class only available for those elements which parent has "kzsbuayyd" class. So the final step is to inject "kzsbuayyd" into the classList of root node of current component every time it renders and boom -- style is applied and isolated from other component's styles. Unfortunately it doesn't work for global ones so keep it in mind.

## Consuming className

Wanna pass some class names to the component from it's parent?
No more extracting and applying className manually!

```js
const Card = ({children})=> (
    <div className="card-bg rounded p-2">
        {children}
    </div>
);
```

styled wrapper will take care of it!
```js
export default styled()(Card);
```

So the code below

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

The principle is very much the same as injecting prefix. You can see how exactly this implemented inside **src/utils/styling.js**.

## Why

I was mostly inspired by Vue.js where you write classes like in normal html, without curly braces and additional prefixes. Also, you don't need to create separate files for the CSS (it's getting really anoying to navigate through them) and you don't need to manually apply className from props with stupid concatenations.
Unfortunately, i haven't found any solution for that. "CSS Modules" forces you to write everything in separate files, "CSS in JS" makes your code look ugly and provides doubt reusability -- thats why i've created my own solution which is satisfying all my demands.

## Robust approach

To be more explicit about grabbing className from props and injecting prefix i have a bit different implementation. It is based on "useClasses" function.

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

It takes "arguments" (it's js keyword) as the first parameter so the function can extract className from props and return it. Besides, you can provide the rest of root node's classes to avoid concatenation.

Prefix also needs to be passed in if there's one. Children's classes stay as usual.
```js
const prefix = css`
  .card {
    width: 300px;
    margin: 0 auto;
    text-align: center;
  }
`;

export default function App() {
  const classes = useClasses(arguments, prefix);
  return (
    <div className={classes}>
      <Card className="card">
        Hello world!
      </Card>
    </div>
  );
}
```

With this approach you can't use arrow functions since they're doesn't support "arguments" keyword, but it makes the code easier to read and fits nicely with React Hooks update.

## CSS syntax highlighting

Don't worry about coding experience when using string literals. With some magic of extensions you can bring CSS syntax highlighting and popus into your js.

For VSCode i use this ones:
https://marketplace.visualstudio.com/items?itemName=AndrewRazumovsky.vscode-styled-jsx-languageserver

https://marketplace.visualstudio.com/items?itemName=blanu.vscode-styled-jsx

![](https://i.imgur.com/uXkBJM0.png)

## Try it out!

```console
git clone https://github.com/MurkyMeow/react-simple-styling.git
```
