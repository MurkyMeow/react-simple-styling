import { isFragment } from './util';
import { Children, cloneElement } from 'react';
import cx from 'classnames';
import escapeTextContentForBrowser from './escape';

export const scopeSelector = (scopeClassName, selector, rootSelectors) => {
  //every :host selector is replaced with scopeClassName
  //to provide simple way to style root element of a component
  /* if(selector.includes(':host'))
    return scopeClassName; */
  //selector = selector.replace(/:host/g, scopeClassName);

  let scopedSelector = [];

  // Matches comma-delimiters in multi-selectors (".fooClass, .barClass {...}" => "," );
  // ignores commas-delimiters inside of brackets and parenthesis ([attr=value], :not()..)
  const groupOfSelectorsPattern = /,(?![^(|[]*\)|\])/g;

  const selectors = selector.split(groupOfSelectorsPattern);

  selectors.forEach(selector => {
    let containsSelector; // .scope .someClass
    let unionSelector; // .scope.someClass (account for root)

    //no need to scope :host, just replace it with scopeClassName
    //it allows :host to reference the root node of a componenet
    if (selector.trim() == ':host') {
      scopedSelector.push(scopeClassName);
    }
    else if (rootSelectors.length && rootSelectors.some(rootSelector => selector.match(rootSelector))) {
      unionSelector = selector;

      // Can't just add them together because of selector combinator complexity
      // like '.rootClassName.someClass.otherClass > *' or :not('.rootClassName'),
      // replace must be used

      // Escape valid CSS special characters that are also RegExp special characters
      const escapedRootSelectors = rootSelectors.map(rootSelector => (
        rootSelector.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
      ));

      unionSelector = unionSelector.replace(new RegExp(
        '(' +                             // Start capture group
        escapedRootSelectors.join('|') +  // Match any one root selector
        ')'                               // End capture group
      ),
        '$1' + scopeClassName              // Replace any one root selector match with a union
      );                                   // of the root selector and scoping class (e.g., .rootSelector._scoped-1). Order matters here because of type-class union support like div._scoped-1

      // Do both union and contains selectors because of case <div><div></div></div>
      // or <div className="foo"><div className="foo"></div></div>
      containsSelector = scopeClassName + ' ' + selector;
      scopedSelector.push(unionSelector, containsSelector);
    } else {
      containsSelector = scopeClassName + ' ' + selector;
      scopedSelector.push(containsSelector);
    }
  });

  return scopedSelector.join(', ');
};

/**
 * Passes the className to the current element
 * or to all of it's children in case we have a fragment
 * @param {string} scope - className to pass to the element
 * @returns {React.ReactElement} element with the scope applied
 * @example
 * scopeElement('foo', <div></div>)
 * //=> <div className="foo"></div>
 * @example
 * scopeElement('foo', <>
 *  <div></div>
 *  <div></div>
 *  <div></div>
 * </>)
 * //=>
 * //<div className="foo"></div>
 * //<div className="foo"></div>
 * //<div className="foo"></div>
 */
export const scopeElement = (scope, element) => {
  let children = element.props.children;
  const className = cx(element.props.className, scope);

  if (isFragment(element)) {
    children = Children.map(children, child => scopeElement(scope, child));
  }

  return cloneElement(element, {...element.props, className}, children);
};

/**
  * Scopes CSS statement with a given scoping class name as a union or contains selector;
  * also escapes CSS declaration bodies
  *    > proccessStyleString( '.foo { color: red; } .bar { color: green; }', '_scoped-1234, ['.root', '.foo']  )
  *    ".scoped-1234.foo { color: red; } .scoped-1234 .bar { color: green; }"
  * @return {!string} Scoped style rule string
*/
export const scopeCSS = (styleString, scopeClassName, rootSelectors) => {
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
              return scopeSelector(scopeClassName, selector, rootSelectors);
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