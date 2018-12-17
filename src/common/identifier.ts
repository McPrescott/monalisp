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
