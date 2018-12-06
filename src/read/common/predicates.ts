// -----------------------------------------------------------------------------
// -- COMMON PREDICATES
//------------------------------------------------------------------------------


import {curry} from '../../~functional';
import {Regex} from './regex';


export const invert = <T extends any[]>(predicate: (...args: T) => boolean) => (
  (...args: T) => !predicate(...args)
);


/**
 * Check if provided characters are the same.
 */
export const isChar = curry((first: string, second: string) => (
  first === second
));


/**
 * Match *string* against *regex*.
 */
export const matches = curry((regex: RegExp, string: string): boolean => (
  regex.test(string)
));


/**
 * Check is provided character is a digit.
 */
export const isDigit = matches(Regex.Digit);


/**
 * Check if provided character is whitespace.
 */
export const isWhitespace = matches(Regex.Space);


/**
 * Check if provided character is a letter.
 */
export const isLetter = matches(Regex.Alpha);


/**
 * Check if provided character is contained within character list.
 */
export const isAnyOf = curry((chars: string[], char: string) => (
  chars.some((current) => current === char)
));
