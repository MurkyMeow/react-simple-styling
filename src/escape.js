/** Escaper used in escapeTextContentForBrowser */
export const escaper = (match) => {
  const ESCAPE_LOOKUP = {
    '>': '&gt;',
    '<': '&lt;'
  };

  return ESCAPE_LOOKUP[match];
}

/**
 * Escapes text to prevent scripting attacks.
 * @param {*} text Text value to escape.
 * @return {string} An escaped string.
 */
const escapeTextContentForBrowser = (text) => {
  const ESCAPE_REGEX = /[><]/g;
  return ('' + text).replace(ESCAPE_REGEX, escaper);
};

export default escapeTextContentForBrowser;