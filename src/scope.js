import { Children, cloneElement } from 'react';

/**
 * @param {string} scope 
 * @param {Array<string>} selectors 
 * scopes all the selectors this way:
 * //.selector => .selector[scope="${scope}"]
 */
export const scopeSelectors = (scope, selectors) => {
  // Matches comma-delimiters in multi-selectors (".fooClass, .barClass {...}" => "," );
  // ignores commas-delimiters inside of brackets and parenthesis ([attr=value], :not()..)
  const groupOfSelectorsPattern = /,(?![^(|[]*\)|\])/g;

  const scopedSelector = selectors
    .split(groupOfSelectorsPattern) //.foo, .bar => ['.foo', '.bar']
    .map(selector => {
      //scope have to go before pseudo class if there's one
      if(selector.includes(':'))
        return selector.replace(/:+/, `[scope="${scope}"]$&`);
        
      return `${selector}[scope="${scope}"]`;
    });

  return scopedSelector.join(', ');
};

/**
 * @param {string} scope - scope attribute to pass to the element and its children
 * @returns {React.ReactElement} element with the scope applied
 * @example
 *    scopeElement('foo', <div><div></div></div>)
 *    //<div scope="foo">
 *    //  <div scope="foo"></div>
 *    //</div>
 */
export const scopeElement = (scope, element) => {
  //avoid scoping non-object (e.g. text) or void nodes
  if(typeof element !== 'object' || !element)
    return element;

  let children = element.props.children;
  if(children) {
    children = Children.map(children, child => scopeElement(scope, child));
    //fix for Children.only throwing an error when the argument is an array
    //even if it only contains 1 element
    if(children.length == 1)
      children = children[0];
  }

  return cloneElement(element, { ...element.props, scope }, children);
};

export const scopeCSS = (styleString, scopeClassName) => {
  const isDeclarationBodyPattern = /.*:.*;/g;
  const isLastItemDeclarationBodyPattern = /.*:.*(;|$)/g;
  const isAtRulePattern = /\s*@/g;
  const isKeyframeOffsetPattern = /\s*(([0-9][0-9]?|100)\s*%)|\s*(to|from)\s*$/g;

  return styleString
    .replace(/\s*\/\/(?![^(]*\)).*|\s*\/\*.*\*\//g, '') // Strip javascript style comments
    .replace(/\s\s+/g, ' ') // Convert multiple to single whitespace
    .split('}') // Start breaking down statements
    .map((fragment) => {
      // Split fragment into selector and declarationBody; escape declaration body
      return fragment.split('{').map((statement, i, arr) => {
        statement = statement.trim();
        // Avoid processing whitespace
        if (!statement.length)
          return '';

        const isDeclarationBodyItemWithOptionalSemicolon = (
          // Only for the last property-value in a
          // CSS declaration body is a semicolon optional
          (arr.length - 1) === i &&
          statement.match(isLastItemDeclarationBodyPattern)
        );
        //declaration bodies and at-rules shouldn't be scoped
        if (
          isDeclarationBodyItemWithOptionalSemicolon ||
          statement.match(isDeclarationBodyPattern) ||
          statement.match(isKeyframeOffsetPattern) ||
          statement.match(isAtRulePattern)
        ) {
          return statement;
        }
        return scopeSelectors(scopeClassName, statement);
      }).join('{\n')
    }).join('}\n');
};