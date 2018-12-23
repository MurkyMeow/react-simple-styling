import precss from 'precss';
import cx from 'classnames';
import nanoid from 'nanoid';

/**
 * Adds scoping to specified css and inserts it into the DOM with <style> tag
 * @param {String} style - normal css string
 * @returns {String} scope class, it should be applied to the root node of a component
 */
export const css = style => {
  const styleNode = document.createElement('style');

  //the letter is added to avoid prefixes that start with a digit (which are not valid css classes)
  const prefix = 's' + nanoid(6);

  precss.process(`
    .${prefix} {
      ${style}
    }
  `).then(({css})=> {
    console.log(css);
    styleNode.innerHTML = css;
    document.head.appendChild(styleNode);
  });

  /*
    transforms the css this way:
    .scope .class {} --> .scope .class, .class.scope {}
    to make all the classes accessible in the root element and fragments
  */
  /* scopedstyle = scopedstyle
    .replace(/\s+/g, ' ')
    .replace(new RegExp(`(\\.${prefix}) ([^,\\s]*)`, 'g'), '$1 $2, $2$1'); */

  return prefix;
};

/**
 * Wraps react component to apply classname from props automatically
 * @param {*} component - component to wrap
 * @param {*} child - used to stop recursive styling of React.Fragment children
 */
export const styleable = (component) => (props) => {
  const vnode = component instanceof Function ? component(props) : component;
  const className = cx(vnode.props.className, props.className) || null;
  let children = vnode.props.children;

  //if the component's root node is fragment we need to style
  //its children individually
  if (children && vnode.type.toString() === 'Symbol(react.fragment)') {
    children = children instanceof Array ?
      children.map(child => styled(child, props.className)()) :
      styled(children, props.className)();
  }

  return { ...vnode, props: { ...vnode.props, className, children } };
};

/**
 * Wraps react component to apply class name every time it renders
 * @param {*} component
 * @param {*} className
 */
export const styled = (component, className) => {
  const styleableComponent = styleable(component);
  return (props) => {
    const newprops = { ...props, className };
    return styleableComponent(newprops);
  };
};