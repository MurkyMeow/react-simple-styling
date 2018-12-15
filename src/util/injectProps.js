/**
 * Wraps React component to change it's vnode props
 * @param {(attributes, props)=> object} injection -
 * function that is called every time wrapped component renders
 * "attributes" are the component's root node attributes
 * and "props" are what was passed into the component from outside
 */
const injectProps = injection => component => props => {
  const vnode = component(props);
  const newProps = injection(vnode.props, props);

  //vnode is immutable so you need to make a copy before changing it =(
  return { ...vnode, props: { ...vnode.props, ...newProps } };
};

export default injectProps;