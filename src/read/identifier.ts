// -----------------------------------------------------------------------------
// -- IDENTIFIER PARSER
//------------------------------------------------------------------------------


import {getIdentifier} from '../common/identifier';
import {pmap, plabel} from './parse/parser';
import {pjoinFlat, star, pair} from './parse/parsers/combinators';
import {satisfyRegex} from './parse/parsers/string';


const idBegin = /[a-z+\-*/=%<>&|!?$_]|\p{Script=Greek}/iu;
const idRest = /[a-z0-9+\-*/=%<>&|!?$_]|\p{Script=Greek}/iu;


/**
 * Literal identifiers.
 */
const literals = {
  nil: null,
  true: true,
  false: false
};


/**
 * Retrieve corresponding identifier value.
 */
const getIdentifierValue = (
  (name: string): null | boolean | IdentifierType => (
    (name in literals)
      ? literals[name]
      : getIdentifier(name)
  )
);


/**
 * Monalisp `Identifier` `Parser`.
 */
export const identifierParser = plabel('identifier', pmap(getIdentifierValue, 
  pjoinFlat(pair(
    satisfyRegex(idBegin),
    star(satisfyRegex(idRest))
  ))
));
