import scope from 'scope-css';
import cx from 'classnames';
import nanoid from 'nanoid';

/**
 * Adds scoping to specified css and inserts it into the DOM with <style> tag
 * @param {String} style - normal css string
 * @returns {String} scope class, it should be applied to the root node of a component
 */
export const css = style => {
  //generate random string for scoping
  const prefix = 's_' + nanoid(7);

  const styleNode = document.createElement('style');
  styleNode.innerHTML = scope(style, `.${prefix}, .${prefix}`);
  document.head.appendChild(styleNode);

  return prefix;
};

/**
 * Wraps react component to apply classname every time it renders
 * @param {*} component
 * @param {*} classname
 * @param {*} child - used internally to stop recursion when working with Fragment
 */
export const styled = (component, classname, child = false) => props => {
  const vnode = child ? component : component(props);
  const className = cx(vnode.props.className, classname);
  let children = vnode.props.children;

  if (!child && children instanceof Array) {
    children = children.map(child => styled(child, classname, true)());
  }

  return { ...vnode, props: { ...vnode.props, className, children } };
}

/**
 * Wraps react component to apply classname from props automatically
 * @param {*} component - component to wrap
 */
export const styleable = component => props => styled(
  component,
  props && props.className
)();

/* For more robust approach */

//the first parameter is an array of caller's arguments
//components usually take only 1 argument which is props
//so we destruct the first element from this array
//and then just concatenate className from it with the rest of provided classes
export const useClasses = ([props], ...classes)=> cx(props.className, classes);