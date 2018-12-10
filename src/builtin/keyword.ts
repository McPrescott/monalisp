// -----------------------------------------------------------------------------
// -- KEYWORD
//------------------------------------------------------------------------------


export class Keyword {
  static of(key: string) {
    return new Keyword(key);
  }

  public readonly uid: Symbol;

  constructor(public readonly key: string) {
    this.uid = Symbol(`Key ${key}`);
  }
}