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


/**
 * Table of existing `Keyword` instances.
 */
const keyTable: {[key: string]: KeywordType} = Object.create(null);


/**
 * Return `Keyword` given it's *name*.
 */
export const getKey = (name: string): KeywordType => (
  (name in keyTable) 
    ? keyTable[name]
    : (keyTable[name] = Keyword.of(name))
);
