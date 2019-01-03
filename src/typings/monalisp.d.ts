// -----------------------------------------------------------------------------
// -- COMMON MONALISP TYPE DEFINITIONS
//------------------------------------------------------------------------------


interface IdentifierType {
  /**
   * Name of this `Identifier`.
   */
  readonly name: string;

  /**
   * Returns name of this `Identifier`, defined primarily for `console.log`.
   */
  toString(): string;
}


interface KeywordType {
  /**
   * Name of this `Keyword`, including the starting colon.
   */
  readonly key: string;

  /**
   * Returns key of this `Keyword`, defined primarily for `console.log`.
   */
  toString(): string;
}


/**
 * Union of Monalisp atoms.
 */
type Atom = null | boolean | number | string | IdentifierType | KeywordType;


/**
 * Base function type in Monalisp.
 */
interface CallableType {
  /**
   * Call function with given *scope* and *parameters*.
   */
  call(scope: ScopeStackType, parameters: FormType[]): EvalResult<FormType>;
}


/**
 * Flag indicating type of a form.
 */
type FormFlagType = number;


/**
 * Union of primitive runtime types that evaluate to themselves.
 */
type Primitive = null | boolean | number | string | KeywordType;



/**
 * Union of all Monalisp runtime types.
 */
type FormType = Atom | ListType | DictionaryType | CallableType;


/**
 * List composed of any Monalisp `FormType`.
 */
interface ListType extends Array<VariableType> {}


/**
 * Map composed of keys and values that may be any Monalisp `FormType`.
 */
interface DictionaryType extends Map<VariableType, VariableType> {}


/**
 * Discrimiated union of variables.
 */
type VariableType =
  | NilVariable
  | BooleanVariable
  | NumberVariable
  | StringVariable
  | IdentifierVariable
  | KeywordVariable
  | ListVariable
  | DictionaryVariable
  | CallableVariable;


interface VariableBase {
  readonly expr: FormType;
  readonly type: 0o1 | 0o2 | 0o4 | 0o10 | 0o20 | 0o40 | 0o100 | 0o200 | 0o400;
  readonly src: CharStream.State;
  readonly file?: string;
}

interface NilVariable extends VariableBase {
  readonly expr: null;
  readonly type: 0o1;
}

interface BooleanVariable extends VariableBase {
  readonly expr: boolean;
  readonly type: 0o2;
}

interface NumberVariable extends VariableBase {
  readonly expr: number;
  readonly type: 0o4;
}

interface StringVariable extends VariableBase {
  readonly expr: string;
  readonly type: 0o10;
}

interface IdentifierVariable extends VariableBase {
  readonly expr: IdentifierType;
  readonly type: 0o20;
}

interface KeywordVariable extends VariableBase {
  readonly expr: KeywordType;
  readonly type: 0o40;
}

interface ListVariable extends VariableBase {
  readonly expr: ListType;
  readonly type: 0o100;
}

interface DictionaryVariable extends VariableBase {
  readonly expr: DictionaryType;
  readonly type: 0o200;
}

interface CallableVariable extends VariableBase {
  readonly expr: CallableType;
  readonly type: 0o400;
}
