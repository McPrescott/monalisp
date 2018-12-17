// -----------------------------------------------------------------------------
// -- KEYWORD
//------------------------------------------------------------------------------


/**
 * Monalisp `Keyword`, often used to an index within a `Dictionary`.
 */
export class Keyword implements KeywordType {

  /**
   * Static factory function for `Keyword`.
   */
  static of(key: string): Keyword {
    return new Keyword(key);
  }

  constructor(public readonly key: string) {}

  /**
   * Return `key` property, useful when used as a key in an object.
   */
  toString(): string {
    return this.key;
  }
}