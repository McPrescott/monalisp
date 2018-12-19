// -----------------------------------------------------------------------------
// -- IDENTIFIER PARSER
//------------------------------------------------------------------------------


import {getIdentifier} from '../common/identifier';
import {pmap, plabel} from './parse/parser';
import {pjoinFlat, star, pair} from './parse/parsers/combinators';
import {satisfyRegex} from './parse/parsers/string';


const idBegin = /[a-z+\-*/=<>&|!?$_]/i;
const idRest = /[a-z0-9+\-*/=<>&|!?$_]/i;


/**
 * Monalisp `Identifier` `Parser`.
 */
export const identifierParser = plabel('identifier', pmap(getIdentifier, 
  pjoinFlat(pair(
    satisfyRegex(idBegin),
    star(satisfyRegex(idRest))
  ))
));
