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
   * Flag for whether arguments should be evaluated before being passed to call.
   */
  readonly shouldEvaluateParameters: boolean;

  /**
   * Call function with given *scope* and *parameters*.
   */
  call(scope: ScopeStackType, parameters: ListVar): EvalResult<VarType>;
}


/**
 * Flag indicating type of a form.
 */
type FormFlagType = {
  readonly Nil        : 0o1,
  readonly Boolean    : 0o2,
  readonly Number     : 0o4,
  readonly String     : 0o10,
  readonly Identifier : 0o20,
  readonly Keyword    : 0o40,
  readonly List       : 0o100,
  readonly Dictionary : 0o200,
  readonly Callable   : 0o400,
  readonly Any        : 0o777 
}


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
interface ListType extends Array<VarType> {}


/**
 * Map composed of keys and values that may be any Monalisp `FormType`.
 */
interface DictionaryType extends Map<VarType, VarType> {}


/**
 * Discrimiated union of variables.
 */
type VarType =
  | NilVar
  | BooleanVar
  | NumberVar
  | StringVar
  | IdentifierVar
  | KeywordVar
  | ListVar
  | DictionaryVar
  | CallableVar;


type FormOf<T extends VarType> = {
  nil: null;
  boolean: boolean;
  number: number;
  string: string;
  identifier: IdentifierType;
  keyword: KeywordType;
  list: ListType;
  dictionary: DictionaryType;
  callable: CallableType;
}[T extends NilVar ? 'nil' 
: T extends BooleanVar ? 'boolean'
: T extends NumberVar ? 'number'
: T extends StringVar ? 'string'
: T extends IdentifierVar ? 'identifier'
: T extends KeywordVar ? 'keyword'
: T extends ListVar ? 'list'
: T extends DictionaryVar ? 'dictionary' : 'callable']


/**
 * Get `VarType` based on given `FormType`
 */
type VarOf<T extends FormType> = {
  nil: NilVar;
  boolean: BooleanVar;
  number: NumberVar;
  string: StringVar;
  identifier: IdentifierVar;
  keyword: KeywordVar;
  list: ListVar;
  dictionary: DictionaryVar;
  callable: CallableVar;
}[T extends null ? 'nil' 
: T extends boolean ? 'boolean'
: T extends number ? 'number'
: T extends string ? 'string'
: T extends IdentifierType ? 'identifier'
: T extends KeywordType ? 'keyword'
: T extends ListType ? 'list'
: T extends DictionaryType ? 'dictionary' : 'callable']


/**
 * Get `FormFlagType` based on given `FormType`
 */
type FormFlagOf<T extends FormType> = {
  nil        : 0o1;
  boolean    : 0o2;
  number     : 0o4;
  string     : 0o10;
  identifier : 0o20;
  keyword    : 0o40;
  list       : 0o100;
  dictionary : 0o200;
  callable   : 0o400;
}[T extends null ? 'nil' 
: T extends boolean ? 'boolean'
: T extends number ? 'number'
: T extends string ? 'string'
: T extends IdentifierType ? 'identifier'
: T extends KeywordType ? 'keyword'
: T extends ListType ? 'list'
: T extends DictionaryType ? 'dictionary' : 'callable']


interface VariableBase {
  // readonly expr: FormType;
  // readonly type: 0o1 | 0o2 | 0o4 | 0o10 | 0o20 | 0o40 | 0o100 | 0o200 | 0o400;
  readonly src: CharStream.State;
  readonly file?: string;
}

interface NilVar extends VariableBase {
  readonly form: null;
  readonly type: 0o1;
}

interface BooleanVar extends VariableBase {
  readonly form: boolean;
  readonly type: 0o2;
}

interface NumberVar extends VariableBase {
  readonly form: number;
  readonly type: 0o4;
}

interface StringVar extends VariableBase {
  readonly form: string;
  readonly type: 0o10;
}

interface IdentifierVar extends VariableBase {
  readonly form: IdentifierType;
  readonly type: 0o20;
}

interface KeywordVar extends VariableBase {
  readonly form: KeywordType;
  readonly type: 0o40;
}

interface ListVar extends VariableBase {
  readonly form: ListType;
  readonly type: 0o100;
}

interface DictionaryVar extends VariableBase {
  readonly form: DictionaryType;
  readonly type: 0o200;
}

interface CallableVar extends VariableBase {
  readonly form: CallableType;
  readonly type: 0o400;
}
