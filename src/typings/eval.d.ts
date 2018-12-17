// -----------------------------------------------------------------------------
// -- EVAL MODULE TYPE DEFINITIONS
//------------------------------------------------------------------------------


interface ScopeConstructor {
  of(entries: Iterable<[IdentifierType, EvalForm]>): ScopeType;
  new(entries: Iterable<[IdentifierType, EvalForm]>): ScopeType;
  readonly prototype: ScopeType;
}


interface ScopeType {
  resolve(id: IdentifierType): EvalForm;
  define(id: IdentifierType, value: EvalForm): EvalForm;
  isDefined(id: IdentifierType): boolean;
}


interface ScopeStackConstructor {
  of(scopes: Iterable<ScopeType>): ScopeStackType;
  new(scopes: Iterable<ScopeType>): ScopeStackType;
  readonly prototype: ScopeStackType;
}


interface ScopeStackType extends Iterable<ScopeType> {
  push(...scopes: ScopeType[]): ScopeStackType;
  pop(): ScopeStackType;
  resolve(id: IdentifierType): EvalForm;
  define(id: IdentifierType, value: EvalForm): EvalForm;
  isDefined(id: IdentifierType): boolean;
}




/**
 * Monalisp function constructor type.
 */
interface ProcedureConstructor {}


/**
 * Monalisp function type. Called procedure to disambiguate from JavaScript's
 * builtin `Function` type.
 */
interface ProcedureType {}


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
