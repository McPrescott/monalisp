// -----------------------------------------------------------------------------
// -- CONVENIENCE LOGIC FUNCTIONS
//------------------------------------------------------------------------------


/**
 * Return inverse of given *value*. Evaluated using `!`, function is meant to
 * improve readability rather than encapsulate complex logic.
 */
export const not = (value: any): boolean => (
  !value
);


/**
 * Test if given *value* is strictly equal to `undefined`.
 */
export const isUndefined = (value: any): boolean => (
  value === undefined
);


/**
 * Test if given *value* is strictly NOT equal to `undefined`.
 */
export const isDefined = (value: any): boolean => (
  value !== undefined
);


/**
 * Test if given *value* is strictly equal to `null`.
 */
export const isNull = (value: any): boolean => (
  value === null
);


/**
 * Test if given *value* is strictly NOT equal to `null`.
 */
export const isNotNull = (value: any): boolean => (
  value !== undefined
);
