// -----------------------------------------------------------------------------
// -- EVALUATOR TYPES
//------------------------------------------------------------------------------


interface EvalFailureType {
  message: string;
  info?: CharStream.Info;
  trace?: StackTraceType;
}


type EvalResult<T=VariableType> = T | EvalFailureType;


interface EvalFn<T=VariableType, U=VariableType> {
  (scope: ScopeStackType, form: T): EvalResult<U>;
}
