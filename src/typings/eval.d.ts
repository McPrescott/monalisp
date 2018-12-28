// -----------------------------------------------------------------------------
// -- EVAL MODULE TYPE DEFINITIONS
//------------------------------------------------------------------------------



// -- Scopes -------------------------------------------------------------------


interface ScopeConstructor {
  of(entries: Iterable<[IdentifierType, EvalForm]>): ScopeType;
  new(entries: Iterable<[IdentifierType, EvalForm]>): ScopeType;
  readonly prototype: ScopeType;
}


/**
 * Represents a single scope in a Monalisp program.
 */
interface ScopeType {

  /**
   * Number of bindings within scope.
   */
  readonly size: number;

  /**
   * Resolve value of given *id*.
   */
  resolve(id: IdentifierType): EvalForm;
  
  /**
   * Set the value of *id* to *value*.
   */
  define(id: IdentifierType, value: EvalForm): EvalForm;

  /**
   * Return whether *id* is defined.
   */
  isDefined(id: IdentifierType): boolean;
}


interface ScopeStackConstructor {
  of(scopes: Iterable<ScopeType>): ScopeStackType;
  new(scopes: Iterable<ScopeType>): ScopeStackType;
  readonly prototype: ScopeStackType;
}


/**
 * Represents the current stack of scopes, from global to innermost `Scope`.
 */
interface ScopeStackType extends Iterable<ScopeType> {

  /**
   * Push given *scopes* onto the stack, returning a new `ScopeStack`.
   */
  push(...scopes: ScopeType[]): ScopeStackType;

  /**
   * Pop most innermost `Scope` from the stack, returning the new `ScopeStack`
   * **NOT** the `Scope` itself.
   */
  pop(): ScopeStackType;

  /**
   * Resolve given *id*, returning `null` when undefined.
   */
  resolve(id: IdentifierType): EvalForm;

  /**
   * Bind given *value* to *id*.
   */
  define(id: IdentifierType, value: EvalForm): EvalForm;

  /**
   * Return whether given *id* is defined in any contained `Scope`.
   */
  isDefined(id: IdentifierType): boolean;
}



// -- Stack Tracing ------------------------------------------------------------


interface StackFrameType {

  /**
   * `Identifier` of the called function.
   */
  id?: IdentifierType;

  /**
   * Information about the position in source where the function was called.
   */
  info: CharStream.Info;
}


interface StackTraceType extends Array<StackFrameType> {}





// -- Runtime Monalisp Types --------------------------------------------------


interface CallableType {
  /**
   * Call function with given *scope* and *parameters*.
   */
  call(scope: ScopeStackType, parameters: TaggedReaderForm[]): 
  EvalResult<EvalForm>
}


/**
 * Monalisp function type. Called procedure to disambiguate from JavaScript's
 * builtin `Function` type.
 */
interface ProcedureType extends CallableType {
  
  /**
   * List of `Identifier` instances, representing the signature of this
   * funciton.
   */
  signature: IdentifierType[];

  /**
   * List of expressions
   */
  body: TaggedReaderForm[];
}


/**
 * Monalisp speical form type.
 */
interface SpecialFormType extends CallableType {}


/**
 * Monalisp list type.
 */
interface ListType extends Array<EvalForm> {}


/**
 * Monalisp dictionary type.
 */
interface DictionaryType extends Map<EvalForm, EvalForm> {}


/**
 * Union of possible evaluation form types.
 */
type EvalForm = AtomType | ListType | DictionaryType | CallableType;


/**
 * Union of primitive runtime types that evaluate to themselves.
 */
type Primitive = null | boolean | number | string | KeywordType;


/**
 * Tagged types that evaluate to themselves at runtime.
 */
type TaggedPrimitive = ReaderTagType<Primitive>;





// -- Evaluator ----------------------------------------------------------------


interface EvaluationFailureConstructor {
  of(message: string, info?: CharStream.Info, trace?: StackTraceType): EvalFailureType;
  new(message: string, info?: CharStream.Info, trace?: StackTraceType): EvalFailureType;
  readonly prototype: EvalFailureType;
}


interface EvalFailureType {
  message: string;
  info?: CharStream.Info;
  trace?: StackTraceType;
}


type EvalResult<T=EvalForm> = T | EvalFailureType;


interface EvalFn<T=TaggedReaderForm, U=EvalForm> {
  (scope: ScopeStackType, form: T): EvalResult<U>;
}
