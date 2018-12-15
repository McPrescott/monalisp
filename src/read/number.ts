// -----------------------------------------------------------------------------
// -- NUMBER PARSER
//------------------------------------------------------------------------------


import {attempt} from './parse/parsers/combinators';
import {parseFloat} from './parse/parsers/numeric';


/**
 * Monalisp `number` `Parser`.
 */
export const numberParser = attempt(parseFloat);
