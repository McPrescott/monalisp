// -----------------------------------------------------------------------------
// -- MONALISP READER
//------------------------------------------------------------------------------


import {CharStream} from './parse/char-stream';
import {run} from './parse/parser';
import {completion, choice, surround} from './parse/parsers/combinators';
import {anySpace} from './parse/parsers/string';
import {ptag} from './tagging';
import {atomParser} from './atom';
import {listParserOf} from './list';
import {dictionaryParserOf} from './dictionary';
import {sExprParser, sExprParserRef, SExpression} from './s-expression';
import {macroParser} from './macro';


/**
 * Monalisp `List` `Parser`.
 */
export const listParser = listParserOf(sExprParser);


/**
 * Monalisp `Dictionary` `Parser`.
 */
export const dictionaryParser = dictionaryParserOf(sExprParser, sExprParser);


sExprParserRef.parser = ptag(choice<SExpression>(
  macroParser,
  atomParser,
  listParser,
  dictionaryParser
));


/**
 * Complete Monalisp `Parser`.
 */
const monalispParser = completion(surround(sExprParser, anySpace));


/**
 * Parse given Monalisp *code*.
 */
export const read = (code: string) => (
  run(monalispParser, CharStream.of(code))
);
