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
export const toFloat = (number: string) => (
  Number.parseFloat(number)
);


/**
 * Return string representation of given *object*.
 */
export const toString = (object) => object.toString();


/**
 * Create a new array from the provided *list*, flattening any nested arrays.
 */
export const flatten = (list: any[]) => {
  let flat = [];
  for (const elem of list) {
    if (Array.isArray(elem))
      flat.push(...flatten(elem));
    else
      flat.push(elem);
  }
  return flat;
};


/**
 * Join list into a string.
 */
export const join = <T>(list: T[], sep="") => (
  list.join(sep)
);


/**
 * Join nested lists into a string.
 */
export const joinFlat = (list: any[], sep="") => (
  flatten(list).join(sep)
);