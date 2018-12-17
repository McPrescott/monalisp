// -----------------------------------------------------------------------------
// -- S-EXPRESSION PARSER
//------------------------------------------------------------------------------


import {plabel} from './parse/parser';
import {fref} from './parse/parsers/combinators';


const [ref, parser] = fref<TaggedReaderForm>();


/**
 * Monalisp forward reference of the `SExpression` `Parser`.
 */
export const readerFormParserRef = ref;

  
/**
 * Monalisp `SExpression` `Parser`.
 */
export const readerFormParser = plabel('s-expression', parser);
