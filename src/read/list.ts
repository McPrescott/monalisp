// -----------------------------------------------------------------------------
// -- LIST PARSER
//------------------------------------------------------------------------------


import {OPEN_PAREN, CLOSE_PAREN} from './parse/common/chars';
import {plabel} from './parse/parser';
import {pair, series, between} from './parse/parsers/combinators';
import {pchar, anySpace, someSpace} from './parse/parsers/string';


const label = plabel('list');
const popen = pair(pchar(OPEN_PAREN), anySpace);
const pclose = pair(anySpace, pchar(CLOSE_PAREN));


/**
 * Return `List` `Parser`, with given *element* `Parser`.
 */
export const listParserOf = <T>(element: ParserType<T>): ParserType<T[]> => {
  const contents = series(element, someSpace);
  return label(between(popen, contents, pclose));
};
