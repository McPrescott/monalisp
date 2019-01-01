// -----------------------------------------------------------------------------
// -- APPLY FUNCTION
//------------------------------------------------------------------------------


import {curry} from './curry';


/**
 * Apply given *argument* to *fn*.
 */
export const apply: Apply = curry(
  <T, U>(argument: T, fn: (argument: T) => U): U => (
    fn(argument)
  )
);

interface Apply {
  <T, U>(argument: T, fn: (argument: T) => U): U;
  <T>(argument: T): <U>(fn: (argument: T) => U) => U;
}
