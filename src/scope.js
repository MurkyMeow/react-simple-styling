import { Children, cloneElement } from 'react';
import escapeTextContentForBrowser from './escape';

const reservedNames = ['body']

export const scopeSelectors = (scope, selectors) => {
  // Matches comma-delimiters in multi-selectors (".fooClass, .barClass {...}" => "," );
  // ignores commas-delimiters inside of brackets and parenthesis ([attr=value], :not()..)
  const groupOfSelectorsPattern = /,(?![^(|[]*\)|\])/g;

  const scopedSelector = selectors
    .split(groupOfSelectorsPattern) //.foo, .bar => ['.foo', '.bar']
    .map(selector => {
      selector = selector.trim();
      //no need to scope selectors like body
      if (reservedNames.includes(selector))
        return selector;
      //.selector => .selector[scope="gHLaE8d"]
      return `${selector}[scope="${scope}"]`;
    });

  return scopedSelector.join(', ');
};

/**
 * @param {string} scope - scope attribute value to pass to the element and its children
 * @returns {React.ReactElement} element with the scope applied
 * @example
 *    scopeElement('foo', <div><div></div></div>)
 *    //<div scope="foo">
 *    //  <div scope="foo"></div>
 *    //</div>
 */
export const scopeElement = (scope, element) => {
  if(typeof element == 'string')
    return element;

  let children = element.props.children;
  children = Children.map(children, child => scopeElement(scope, child));

  //fix for Children.only throwing an error when the argument is an array
  //even if it only contains 1 element
  if(children.length == 1)
    children = children[0];

  return cloneElement(element, { ...element.props, scope }, children);
};

/**
  * Scopes CSS statement with a given scoping class name as a union or contains selector;
  * also escapes CSS declaration bodies
  *    > proccessStyleString( '.foo { color: red; } .bar { color: green; }', '_scoped-1234, ['.root', '.foo']  )
  *    ".scoped-1234.foo { color: red; } .scoped-1234 .bar { color: green; }"
  * @return {!string} Scoped style rule string
*/
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
        // Avoid processing whitespace
        if (!statement.trim().length) {
          return '';
        }

        const isDeclarationBodyItemWithOptionalSemicolon = (
          // Only for the last property-value in a
          // CSS declaration body is a semicolon optional
          (arr.length - 1) === i &&
          statement.match(isLastItemDeclarationBodyPattern)
        );
        // Skip escaping selectors statements since that would break them;
        // note in docs that selector statements are not escaped and should
        // not be generated from user provided strings
        if (statement.match(isDeclarationBodyPattern) || isDeclarationBodyItemWithOptionalSemicolon) {
          return escapeTextContentForBrowser(statement);
        } else { // Statement is a selector
          const selector = statement;

          if (scopeClassName && !/:target/gi.test(selector)) {
            // Prefix the scope to the selector if it is not an at-rule
            if (!selector.match(isAtRulePattern) && !selector.match(isKeyframeOffsetPattern)) {
              return scopeSelectors(scopeClassName, selector);
            } else {
              // Is at-rule or keyframe offset and should not be scoped
              return selector;
            }
          } else {
            // No scope; do nothing to the selector
            return selector;
          }
        }
      }).join('{\n')
    }).join('}\n');
};