/** Checks if an element is React.Fragment */
export const isFragment = element => (
  'Symbol(react.fragment)' == element.type.toString()
);

/** concatenates tag string temlpates with corresponding values */
export const tagToString = (templates, values) => (
  templates
    .map((template, i)=> template + (values[i] || ''))
    .join('')
);