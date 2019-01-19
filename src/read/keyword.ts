// -----------------------------------------------------------------------------
// -- KEYWORD PARSER
//------------------------------------------------------------------------------


import {getKey} from '../common/keyword';
import {COLON} from './parse/common/chars';
import {plabel, pmap} from './parse/parser';
import {pjoinFlat, pair, plus} from './parse/parsers/combinators';
import {pchar, satisfyRegex} from './parse/parsers/string';



const label = plabel('keyword');
const pcolon = pchar(COLON);
const validChars = satisfyRegex(/[a-z0-9+\-*/=%<>&|!?$_]|\p{Script=Greek}/i);
const keyString = pjoinFlat(pair(pcolon, plus(validChars)));


/**
 * Monalisp `Keyword` `Parser`.
 */
export const keywordParser = label(pmap(getKey, keyString));
