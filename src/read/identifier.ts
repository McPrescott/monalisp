// -----------------------------------------------------------------------------
// -- IDENTIFIER PARSER
//------------------------------------------------------------------------------


import {Identifier} from '../builtin/identifier';
import {pmap, plabel} from './parse/parser';
import {pjoinFlat, star, pair} from './parse/parsers/combinators';
import {satisfyRegex} from './parse/parsers/string';


/**
 * Literal identifiers.
 */
const literals = {
  nil: null,
  true: true,
  false: false
};


const idBegin = /[a-z+\-*/=<>&|!?$_]/i;
const idRest = /[a-z0-9+\-*/=<>&|!?$_]/i;


const identifierTable: {[key: string]: Identifier} = Object.create(null);


/**
 * Return `Identifier` given it's *name*, literal identifier, e.g "true", will
 * return corresponding literal value.  
 */
export const getIdentifier = (name: string): boolean | Identifier => (
  (name in literals)
    ? literals[name]
    : (name in identifierTable)
      ? identifierTable[name]
      : (identifierTable[name] = Identifier.of(name))
);


/**
 * Monalisp `Identifier` `Parser`.
 */
export const identifierParser = plabel('identifier', pmap(getIdentifier, 
  pjoinFlat(pair(
    satisfyRegex(idBegin),
    star(satisfyRegex(idRest))
  ))
));
