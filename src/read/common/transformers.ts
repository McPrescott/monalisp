import { pmap, Parser } from "../parser";

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
 * Parse hexadecimal string into number.
 */
export const hexStringToNumber = (hexString: string) => (
  Number.parseInt(hexString, 16)
);


/**
 * Parse octal string into number.
 */
export const octalStringToNumber = (octalString: string) => (
  Number.parseInt(octalString, 8)
);


/**
 * Parse octal string into number.
 */
export const binaryStringToNumber = (binaryString: string) => (
  Number.parseInt(binaryString, 2)
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
export const join = <T>(ls: T[], sep=""/*String.empty*/) => (
  ls.join(sep)
);


/**
 * Join list contained in *parser* into a string.
 */
export const pjoin = (parser: Parser<any[]>, sep="") => (
  pmap((parsed) => parsed.join(sep), parser)
);
