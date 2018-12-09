import scope from 'scope-css';
import cx from 'classnames';

export const css = style => {
  //generate random string like "onixdtkg" or "ygcpqlrfo"
  //(don't pay much attention on it, it's just placeholder algorithm
  //and needs to be replaced with something more reliable)
  const prefix = Math.random().toString(36).substr(2).match(/[a-zA-Z]+/g).join('');

  //add this string to all selectors of specified css
  //and insert it into the DOM
  const styleNode = document.createElement('style');
  styleNode.innerHTML = scope(style, '.' + prefix);
  document.head.appendChild(styleNode);

  //prefix is returned to be added into classList
  //of root node of a component
  return prefix;
}

//wrapper for our components which allows them
//to consume className from props and injects prefix
//automatically (>^_^)>
export const styled = prefix => component => props => {
  const vnode = component(props);
  const className = cx(prefix, vnode.props.className, props.className);

  //vnode is immutable so in order to modify it
  //you must make a copy =(
  return {...vnode, props: { ...vnode.props, className }}
}


/* For more robust approach */

//grabs className from props and injects it into class list
export function useClasses([{className}], ...classes) {
  classes.push(className);
  return cx(classes);
}