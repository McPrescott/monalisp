// -----------------------------------------------------------------------------
// -- MONALISP READER
//------------------------------------------------------------------------------


import {CharStream} from './parse/char-stream';
import {run} from './parse/parser';
import {completion, choice, surround} from './parse/parsers/combinators';
import {anySpace} from './parse/parsers/string';
import {sExpressionParser} from './s-expression';
import {macroParser} from './macro';
import {ptag} from './tagging';


/**
 * `Parser` of `SExpression` or `Macro`.
 */
const expression = choice(ptag(macroParser), sExpressionParser);


/**
 * Complete Monalisp `Parser`.
 */
const monalispParser = 
  completion(surround(expression, anySpace));
// before(completion(after(anySpace, expression)), anySpace);


/**
 * Parse given Monalisp *code*.
 */
export const read = (code: string) => (
  run(monalispParser, CharStream.of(code))
);
