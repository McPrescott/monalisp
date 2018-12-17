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
import {readerFormParser, readerFormParserRef} from './s-expression';
import {macroParser} from './macro';


/**
 * Monalisp `List` `Parser`.
 */
export const listParser = listParserOf(readerFormParser);


/**
 * Monalisp `Dictionary` `Parser`.
 */
export const dictionaryParser = dictionaryParserOf(readerFormParser, readerFormParser);


readerFormParserRef.parser = ptag(choice<ReaderForm>(
  macroParser,
  atomParser,
  listParser,
  dictionaryParser
));


/**
 * Complete Monalisp `Parser`.
 */
const monalispParser = completion(surround(readerFormParser, anySpace));


/**
 * Parse given Monalisp *code*.
 */
export const read = (code: string) => (
  run(monalispParser, CharStream.of(code))
);
