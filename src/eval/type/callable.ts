// -----------------------------------------------------------------------------
// -- CALLABLE BASE CLASS
//------------------------------------------------------------------------------


/**
 * Base class for callable classes including `Procedure`, `SpecialForm`, et
 * cetera.
 */
export abstract class Callable implements CallableType {
  abstract call(scope: ScopeStackType, parameters: TaggedReaderForm[]): 
  EvalResult<EvalForm>;
}
