// -----------------------------------------------------------------------------
// -- EVAL MODULE TYPE DEFINITIONS
//------------------------------------------------------------------------------


interface VarTableConstructor {
  of(entries: Iterable<[IdentifierType, EvalForm]>): VarTableType;
  new(entries: Iterable<[IdentifierType, EvalForm]>): VarTableType;
  readonly prototype: VarTableType;
}


interface VarTableType {
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
