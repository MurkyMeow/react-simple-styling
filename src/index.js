import nanoid from 'nanoid/non-secure';
import { scopeCSS, scopeElement } from './scope';

/**
 * Adds scoping to specified css and inserts it into the DOM with <style> tag
 * @returns {Function} - wrapper for React.Element that applies styling to it
*/
export const css = styleString => {
  //fix for tag strings that return an array =d
  styleString = styleString.toString();

  const scope = nanoid(7);
  const styleNode = document.createElement('style');
  styleNode.id = scope;
  styleNode.innerHTML = scopeCSS(styleString, scope);
  document.head.appendChild(styleNode);

  return (element)=> scopeElement(scope, element);
};

/** Wraps a React component to allow it consume className from props automatically */
export const styleable = component => props => {
  //doesn't work for some reason =d
  //const element = createElement(component, props);

  const element = component(props);
  return scopeElement(props.className, element);
};