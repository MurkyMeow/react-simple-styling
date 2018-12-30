/** Checks if an element is React.Fragment */
export const isFragment = element => (
  'Symbol(react.fragment)' == element.type.toString()
);