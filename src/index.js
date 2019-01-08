import nanoid from 'nanoid/non-secure';
import { scopeCSS, scopeElement } from './scope';
import { cloneElement } from 'react';
import { tagToString } from './util';

/**
 * @param {string} style - CSS string
 * Adds scoping to specified css and inserts it into the DOM with <style> tag
 * @returns {Function} - wrapper for React.Element that applies styling to it
*/
export const css = (style, ...values) => {
  const styleString = tagToString(style, values);

  console.log(styleString);

  const scope = nanoid(7);
  const styleNode = document.createElement('style');
  styleNode.id = scope;
  styleNode.innerHTML = scopeCSS(styleString, scope);
  document.head.appendChild(styleNode);

  return (element)=> scopeElement(scope, element);
};

/** Wraps a React component to allow it consume className from props automatically */
export const styleable = component => props => {
  //const element = createElement(component, props); props aren't passed for some reason =d
  const element = component(props);

  //concatenate classes and filter out falsy values
  const className = [
    element.props.className,
    props.className
  ].filter(x => x).join(' ') || null;

  return cloneElement(element, { ...element.props, className });
};