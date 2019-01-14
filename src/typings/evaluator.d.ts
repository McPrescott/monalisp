// -----------------------------------------------------------------------------
// -- EVALUATOR TYPES
//------------------------------------------------------------------------------


interface EvalFailureType {
  message: string;
  src?: CharStream.State;
  trace?: StackTraceType;
}


type EvalResult<T=VarType> = T | EvalFailureType;


interface EvalFn<T=VarType, U=VarType> {
  (scope: ScopeStackType, form: T): EvalResult<U>;
}
