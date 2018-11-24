import {curry, map, range} from 'ramda';


/**
 * Empty string value.
 */
export const empty = "";


/**
 * Test if two strings are identical (uses strict equals `===`).
 */
export const isChar = curry((test: string, str: string) => (
  test === str
));


/**
 * Test if two strings are not identical (uses strict inequality `!==`).
 */
export const isNotChar = curry((test: string, str: string) => (
  test !== str
));


/**
 * Test regular expression *test* matches *str*.
 */
export const test = curry((test: RegExp, str: string) => (
  str.search(test) !== -1
));


/**
 * Test if regular expression *test* does not match *str*.
 */
export const testNot = curry((test: RegExp, str: string) => (
  str.search(test) === -1
));


/**
 * Return character corresponding to *charCode*.
 */
export const fromCode = (charCode: number) => (
  String.fromCharCode(charCode)
);


/**
 * Return character code of given *char*.
 */
export const codeOf = (char: string) => (
  char.charCodeAt(0)
);


/**
 * Return character code of *str* at given *pos*.
 */
export const codeAt = curry((pos: number, str: string) => (
  str.charCodeAt(pos)
));


/**
 * Return list of characters from *lower* to *upper* inclusive.
 */
export const charRange = curry((lower: string, upper: string) => (
  map(fromCode, range(codeOf(lower), codeOf(upper)+1))
));


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
