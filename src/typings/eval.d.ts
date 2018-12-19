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


/**
 * Monalisp function constructor type.
 */
interface ProcedureConstructor {}


/**
 * Monalisp function type. Called procedure to disambiguate from JavaScript's
 * builtin `Function` type.
 */
interface ProcedureType {
  
  /**
   * List of `Identifier` instances, representing the signature of this
   * funciton.
   */
  signature: TaggedIdentifierType[];

  /**
   * List of expressions
   */
  body: TaggedReaderForm[];
}


/**
 * Monalisp special form constructor type.
 */
interface SpecialFormConstructor {}


/**
 * Monalisp speical form type.
 */
interface SpecialFormType {}


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
type EvalForm = AtomType | ListType | DictionaryType | ProcedureType | SpecialFormType;


/**
 * Union of primitive runtime types that evaluate to themselves.
 */
type SelfEvaluatingForm = boolean | number | string | KeywordType;




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


type EvalResult<T extends EvalForm> = T | EvalFailureType;


interface EvalFunctionType<A extends TaggedReaderForm, B extends EvalForm> {
  (scope: ScopeStackType, form: A): EvalResult<B>;
}


interface EvaluatorConstructor {
  of<T extends TaggedReaderForm, U extends EvalForm>(
    run: EvalFunctionType<T, U>): EvaluatorType<T, U>;
  new<T extends TaggedReaderForm, U extends EvalForm>(
    run: EvalFunctionType<T, U>): EvaluatorType<T, U>;
  readonly prototype: EvaluatorType<TaggedReaderForm, EvalForm>;
}


interface EvaluatorType<T extends TaggedReaderForm, U extends EvalForm> {
  run: EvalFunctionType<T, U>;
}
