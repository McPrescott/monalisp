// -----------------------------------------------------------------------------
// -- MONALISP READER
//------------------------------------------------------------------------------


import {CharStream} from './parse/char-stream';
import {run} from './parse/parser';
import {after, completion} from './parse/parsers/combinators';
import {anySpace} from './parse/parsers/string';
import {sExpressionParser} from './s-expression';



/**
 * Complete Monalisp `Parser`.
 */
const monalispParser = completion(after(anySpace, sExpressionParser));


/**
 * Parse given Monalisp *code*.
 */
export const read = (code: string) => (
  run(monalispParser, CharStream.of(code))
);
