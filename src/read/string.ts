// -----------------------------------------------------------------------------
// -- STRING PARSER
//------------------------------------------------------------------------------


import {DOUBLE_QUOTE} from './parse/common/chars';
import {invert, isChar} from './parse/common/predicates';
import {plabel} from './parse/parser';
import {pjoin, star, between} from './parse/parsers/combinators';
import {pchar, satisfy} from './parse/parsers/string';



const quote = pchar(DOUBLE_QUOTE);
const contents = pjoin(star(satisfy(invert(isChar(DOUBLE_QUOTE)))));


/**
 * Monalisp `string` `Parser`.
 */
export const stringParser = plabel('string', between(quote, contents, quote));
