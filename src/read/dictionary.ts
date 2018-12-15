// -----------------------------------------------------------------------------
// -- DICTIONARY PARSER
//------------------------------------------------------------------------------


import {OPEN_CURLY, CLOSE_CURLY} from './parse/common/chars';
import {plabel, Parser, pmap} from './parse/parser';
import {pair, plus, series, after, between} from './parse/parsers/combinators';
import {anySpace, pchar, satisfyRegex, someSpace} from './parse/parsers/string';


const label = plabel('dictionary');
const popen = pair(pchar(OPEN_CURLY), anySpace);
const pclose = pair(anySpace, pchar(CLOSE_CURLY));
const someSpaceOrComma = plus(satisfyRegex(/\s|,/));


/**
 * Return `Map` from given list of [key, value] pairs, *kvpairs*.
 */
const mapOf = <K, V>(kvpairs: [K, V][]): Map<K, V> => new Map(kvpairs);


/**
 * Return `Dictionary` `Parser`, with given *key* and *value* `Parser`s.
 */
export const dictionaryParserOf = (
  <K, V>(key: Parser<K>, value: Parser<V>): Parser<Map<K, V>> => {
    const kvpair = pair(key, after(someSpace, value));
    const kvpairs = series(kvpair, someSpaceOrComma);
    return label(
      pmap(mapOf, between(popen, kvpairs, pclose)) as Parser<Map<K, V>>
    );
  }
);
