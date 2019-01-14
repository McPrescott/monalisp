// -----------------------------------------------------------------------------
// -- CALLABLE BASE CLASS
//------------------------------------------------------------------------------


/**
 * Base class for callable classes including `Procedure`, `SpecialForm`, et
 * cetera.
 */
export abstract class Callable implements CallableType {

  abstract get shouldEvaluateParameters(): boolean;

  abstract call(scope: ScopeStackType, parameters: ListVar): EvalResult<VarType>;
}
