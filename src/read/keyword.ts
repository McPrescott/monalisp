// -----------------------------------------------------------------------------
// -- KEYWORD PARSER
//------------------------------------------------------------------------------


import {Keyword} from '../common/keyword';
import {COLON} from './parse/common/chars';
import {plabel, pmap} from './parse/parser';
import {pjoinFlat, pair, plus} from './parse/parsers/combinators';
import {pchar, satisfyRegex} from './parse/parsers/string';


/**
 * Table of existing `Keyword` instances.
 */
const keyTable: {[key: string]: KeywordType} = Object.create(null);


/**
 * Return `Keyword` given it's *name*.
 */
export const getKey = (name: string): KeywordType => (
  (name in keyTable) 
    ? keyTable[name]
    : (keyTable[name] = Keyword.of(name))
);


const label = plabel('keyword');
const pcolon = pchar(COLON);
const validChars = satisfyRegex(/[a-z0-9+\-*/=<>&|!?$_]/i);
const keyString = pjoinFlat(pair(pcolon, plus(validChars)));


/**
 * Monalisp `Keyword` `Parser`.
 */
export const keywordParser = label(pmap(getKey, keyString));
