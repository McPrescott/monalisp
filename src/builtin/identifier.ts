// -----------------------------------------------------------------------------
// -- IDENTIFIER
//------------------------------------------------------------------------------


export class Identifier {
  static of(name: string) {
    return new Identifier(name);
  }
  
  constructor(public readonly name: string) {}
  
  toString() {
    return this.name;
  }
}


export const Id = Identifier;