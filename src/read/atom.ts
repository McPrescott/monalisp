// -----------------------------------------------------------------------------
// -- ATOM PARSERS
//------------------------------------------------------------------------------


import {Identifier} from '../builtin/identifier';
import {Keyword} from '../builtin/keyword';
import {plabel} from './parse/parser';
import {choice} from './parse/parsers/combinators';
import {numberParser} from './number';
import {stringParser} from './string';
import {identifierParser} from './identifier';
import {keywordParser} from './keyword';


/**
 * Monalisp `AtomType` is any of `nil`, `boolean`, `number`, `string`,
 * `Identifier` or `Keyword`.
 */
export type AtomType = null | boolean | string | number | Identifier | Keyword;


/**
 * Monalisp `AtomType` `Parser`, where `AtomType` is any of `nil`, `boolean`,
 * `number`, `string`, `Identifier` or `Keyword`.
 */
export const atomParser = plabel('atom', choice<AtomType>([
  numberParser,
  stringParser,
  identifierParser,
  keywordParser
]));
