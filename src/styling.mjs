import nanoid from 'nanoid';
import { scopeCSS, scopeElement } from './scope';
import { getRootSelectors } from './util';

//used to store scopes to prevent the duplication of <style> tags
const cache = {};

/** Adds scoping to specified css and inserts it into the DOM with <style> tag */
export const css = styleString => element => {
  const identifier = styleString;
  if (!cache[identifier]) {
    const styleNode = document.createElement('style');

    //the letter is added to avoid scopes that start with a digit
    //(which are not valid css classes)
    const scope = 's' + nanoid(6);
    const scopedCSS = scopeCSS(styleString.toString(), `.${scope}`, getRootSelectors(element));

    styleNode.innerHTML = scopedCSS;
    document.head.appendChild(styleNode);
    cache[identifier] = scope;
  }
  return scopeElement(cache[identifier], element);
};

/** Wraps a React component to allow it consume className from props automatically */
export const styleable = component => props => {
  //doesn't work for some reason =d
  //const element = createElement(component, props);

  const element = component(props);
  return scopeElement(props.className, element);
};