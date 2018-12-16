// -----------------------------------------------------------------------------
// -- S-EXPRESSION PARSER
//------------------------------------------------------------------------------


import {plabel} from './parse/parser';
import {fref} from './parse/parsers/combinators';
import {Tagged} from './tagging';
import {AtomType} from './atom';


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
 * Monalisp forward reference of the `SExpression` `Parser`.
 */
export const sExprParserRef = ref;

  
/**
 * Monalisp `SExpression` `Parser`.
 */
export const sExprParser = plabel('s-expression', parser);
