// -----------------------------------------------------------------------------
// -- NUMERIC PARSERS
//------------------------------------------------------------------------------


import {pipe} from '../../~functional';
import {MINUS, DOT} from '../common/chars';
import {isDigit, matches} from '../common/predicates';
import {toInt, join, toFloat, hexStringToNumber, octalStringToNumber, binaryStringToNumber} from '../common/transformers';
import {satisfy, parseChar} from './string';
import {plus, sequence, optional} from './combinators';
import {Regex} from '../common/regex';


const parseMinus = parseChar(MINUS);

const parseDot = parseChar(DOT);

const joinToInt = pipe(join, toInt);

const joinToFloat = pipe(join, toFloat);


/**
 * `Parser` for sequence of digits, returned as a string. This `Parser` will
 * return `ParseFailure` if zero digits are found.
 */
export const parseDigits = plus(satisfy(isDigit), 'integer').map(join);


/**
 * `Parser` for sequence of hexadecimal digits, 0-9 a-f A-F, returns a string or
 * `ParseFailure` if zero digits are found.
 */
export const parseHexDigits = (
  plus(satisfy(matches(Regex.Hex)), 'hex digits').map(join)
);


/**
 * `Parser` for sequence of one or more octal digits, returning a string upon
 * successful completion.
 */
export const parseOctalDigits = (
  plus(satisfy(matches(Regex.Octal), 'octal digits')).map(join)
);


/**
 * `Parser` for sequence of one or more binary digits, returning a string upon
 * successful completion.
 */
export const parseBinaryDigits = (
  plus(satisfy(matches(Regex.Binary), 'binary digits')).map(join)
);


/**
 * `Parser` for an integer of base ten, returns a number.
 */
export const parseInt = (
  sequence([
    optional(parseMinus), 
    parseDigits
  ], 'integer').map(joinToInt)
);


/**
 * `Parser` for float, with optional sign and decimal places.
 */
export const parseFloat = (
  sequence([
    optional(parseMinus),
    parseDigits,
    optional(sequence([
      parseDot,
      parseDigits
    ])).map(join)
  ], 'float').map(joinToFloat)
);


/**
 * `Parser` for hexadecimal number with optional sign.
 */
export const parseHex = (
  sequence([
    optional(parseMinus),
    parseHexDigits
  ], 'hexadecimal number').map(pipe(join, hexStringToNumber))
);


/**
 * `Parser` for octal number with optional sign.
 */
export const parseOctal = (
  sequence([
    optional(parseMinus),
    parseOctalDigits
  ], 'octal number').map(pipe(join, octalStringToNumber))
);


/**
 * `Parser` for binary number with optional sign.
 */
export const parseBinary = (
  sequence([
    optional(parseMinus),
    parseBinaryDigits
  ], 'binary number').map(pipe(join, binaryStringToNumber))
);
