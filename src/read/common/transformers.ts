// -----------------------------------------------------------------------------
// -- TRANSFORMERS
//------------------------------------------------------------------------------

/**
 * Parse integer from *string*, with optional *base*. If *base* is not
 * supplied, strings with a prefix of '0x' are considered hexadecimal. All other
 * strings are considered decimal.
 */
export const toInt = (string: string, base?: number) => (
  Number.parseInt(string, base)
);


/**
 * Parse decimal from *string*.
 */
export const toFloat = (string: string) => (
  Number.parseFloat
);


/**
 * Return string representation of given *object*.
 */
export const toString = (object) => object.toString();


/**
 * Join list into a string.
 */
export const join = <T>(ls: T[], seperator=""/*String.empty*/) => (
  ls.join(seperator)
);
