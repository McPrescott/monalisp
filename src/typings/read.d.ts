// -----------------------------------------------------------------------------
// -- READ MODULE TYPE DEFINITIONS
//------------------------------------------------------------------------------



// -- Reader Tag ---------------------------------------------------------------



type ReaderFormFlagType = 0o1| 0o2 | 0o4 | 0o10 | 0o20 | 0o40 | 0o100 | 0o200;


interface ReaderTagConstructor {
  of<T>(expression: T, type: ReaderFormFlagType, info: CharStream.Info): ReaderTagType<T>;
  fromExpanded<T>(expression: T, type: ReaderFormFlagType, info: CharStream.Info): ReaderTagType<T>;
  new<T>(expression: T, type: ReaderFormFlagType, info: CharStream.Info, isExpanded: boolean): ReaderTagType<T>;
  readonly prototype: ReaderTagType<any>;
}


interface ReaderTagType<T> {
  readonly expression: T, 
  readonly type: ReaderFormFlagType,
  readonly info: CharStream.Info,
  readonly isExpanded: boolean;
}



// -- Reader Forms -------------------------------------------------------------


/**
 * Monalisp `AtomType` is any of `nil`, `boolean`, `number`, `string`,
 * `Identifier` or `Keyword`.
 */
type AtomType = null | boolean | number | string | IdentifierType | KeywordType;


/**
 * Monalisp `List` type.
 */
interface ReaderListType extends Array<TaggedReaderForm> {}


/**
 * Monalisp `Dictionary` type.
 */
interface ReaderDictionaryType extends Map<TaggedReaderForm, TaggedReaderForm> {}


/**
 * Union of possible Monalisp reader types.
 */
type ReaderForm = AtomType | ReaderListType | ReaderDictionaryType;



// -- Convenience Reader Forms -------------------------------------------------


/**
 * Abbrivated type alias for `ReaderTagType<IdentifierType>`.
 */
type TaggedIdentifierType = ReaderTagType<IdentifierType>;


/**
 * Abbrivated type alias for `ReaderTagType<KeywordType>`.
 */
type TaggedKeywordType = ReaderTagType<KeywordType>;


/**
 * Abbrivated type alias for `ReaderTagType<AtomType>`.
 */
type TaggedAtomType = ReaderTagType<AtomType>;


/**
 * Abbrivated type alias for `ReaderTagType<ReaderListType>`.
 */
type TaggedReaderListType = ReaderTagType<ReaderListType>;


/**
 * Abbrivated type alias for `ReaderTagType<ReaderDictionaryType>`.
 */
type TaggedReaderDictionaryType = ReaderTagType<ReaderDictionaryType>;


/**
 * Abbrivated type alias for `ReaderTagType<ReaderForm>`.
 */
type TaggedReaderForm = ReaderTagType<ReaderForm>;
