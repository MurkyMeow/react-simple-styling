import scope from 'scope-css';
import cx from 'classnames';

/**
 * Adds scoping to specified css and inserts it into the DOM
 * with <style> tag
 * @param {String} style - normal css string
 * @returns {String} scope. Add it to the root node's classList to make style works
 */
export const css = style => {
  const prefix = Math.random().toString(36).substr(2).match(/[a-zA-Z]+/g).join('');

  const styleNode = document.createElement('style');
  styleNode.innerHTML = scope(style, '.' + prefix);
  document.head.appendChild(styleNode);

  return prefix;
}

/**
 * Wraps React component to allow it consume className from props automatically
 * @param {String} prefix - additional className that will be injected into root node of the component. Usually you get it from "css" function
 */
export const styled = prefix => component => props => {
  const vnode = component(props);
  const className = cx(prefix, vnode.props.className, props.className);

  //vnode is immutable so in order to modify it
  //you must make a copy =(
  return {...vnode, props: { ...vnode.props, className }}
}


/* For more robust approach */

//the first parameter is an array of caller's arguments
//components usually take only 1 argument which is props
//so we destruct the first element from this array
//and then just concatenate className from it with the rest of provided classes
export const useClasses = ([props], ...classes)=> cx(props.className, classes);