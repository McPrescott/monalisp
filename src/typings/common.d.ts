// -----------------------------------------------------------------------------
// -- COMMON MONALISP TYPE DEFINITIONS
//------------------------------------------------------------------------------


interface IdentifierConstructor {
  of(name: string): IdentifierType;
  new(name: string): IdentifierType;
  readonly prototype: IdentifierType;
}


interface IdentifierType {
  readonly name: string;
  toString(): string;
}


interface KeywordConstructor {
  of(key: string): KeywordType;
  new(key: string): KeywordType;
  readonly prototype: KeywordType;
}


interface KeywordType {
  readonly key: string;
  toString(): string;
}
