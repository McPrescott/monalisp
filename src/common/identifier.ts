// -----------------------------------------------------------------------------
// -- IDENTIFIER
//------------------------------------------------------------------------------


/**
 * Monalisp `Identifier`, of called *symbol* in other lisp-like languages.
 */
export class Identifier implements IdentifierType {

  /**
   * Static factory function for `Identifier`.
   */
  static of(name: string): Identifier {
    return new Identifier(name);
  }
  
  constructor(public readonly name: string) {}
  
  /**
   * Returns `name` property, useful when used as a key in an object.
   */
  toString(): string {
    return this.name;
  }
}


export const Id = Identifier;


/**
 * Literal identifiers.
 */
const literals = {
  nil: null,
  true: true,
  false: false
};


const identifierTable: {[key: string]: IdentifierType} = Object.create(null);


/**
 * Return `Identifier` given it's *name*, literal identifier, e.g "true", will
 * return corresponding literal value.  
 */
export const getIdentifier = (name: string): boolean | IdentifierType => (
  (name in literals)
    ? literals[name]
    : (name in identifierTable)
      ? identifierTable[name]
      : (identifierTable[name] = Identifier.of(name))
);
