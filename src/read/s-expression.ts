// -----------------------------------------------------------------------------
// -- S-EXPRESSION PARSER
//------------------------------------------------------------------------------


import {plabel} from './parse/parser';
import {fref, choice} from './parse/parsers/combinators';
import {ptag, Tagged} from './tagging';
import {atomParser, AtomType} from './atom';
import {listParserOf} from './list';
import {dictionaryParserOf} from './dictionary';


/**
 * Monalisp `SExpression` type.
 */
export type SExpression = AtomType | List | Dictionary;


/**
 * Abbrivated type alias for `Tagged<SExpression>`.
 */
export type TaggedSExpression = Tagged<SExpression>;


/**
 * Monalisp `List` type.
 */
export interface List extends Array<TaggedSExpression> {}


/**
 * Monalisp `Dictionary` type.
 */
export interface Dictionary extends Map<TaggedSExpression, TaggedSExpression> {}



const [ref, parser] = fref<TaggedSExpression>();


/**
 * Monalisp `List` `Parser`.
 */
export const listParser = listParserOf(parser);


/**
 * Monalisp `Dictionary` `Parser`.
 */
export const dictionaryParser = dictionaryParserOf(parser, parser);


ref.parser = ptag(choice<SExpression>(
  atomParser,
  listParser,
  dictionaryParser
));


const label = plabel('s-expression');
  
/**
 * Monalisp `SExpression` `Parser`.
 */
export const sExpressionParser = label(parser);
