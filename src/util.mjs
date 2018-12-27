import { Children } from 'react';

export const getRootSelectors = (rootElement, selectors = []) => {
  if (isFragment(rootElement)) {
    for (let child of Children.toArray(rootElement.props.children))
      getRootSelectors(child, selectors);
    return selectors;
  }

  // Handle id
  if (rootElement.props.id)
    selectors.push('#' + rootElement.props.id);

  // Handle classes
  if (rootElement.props.className)
    rootElement.props.className.trim().split(/\s+/g).forEach(className => selectors.push(className));

  // Handle no root selector by using type
  if (!selectors.length && typeof rootElement.type !== 'function')
    selectors.push(rootElement.type);

  return selectors;
};

/** Checks if an element is React.Fragment */
export const isFragment = element => (
  'Symbol(react.fragment)' == element.type.toString()
);