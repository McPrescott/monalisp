// -----------------------------------------------------------------------------
// -- MONALISP EVALUATOR
//------------------------------------------------------------------------------


/**
 * Represents `Evaluator` error.
 */
export class EvalFailure implements EvalFailureType {

  /**
   * Static factory function for `EvalFailure`.
   */
  static of(message: string, info?: CharStream.Info, trace?: StackTraceType): EvalFailureType {
    return new EvalFailure(message, info, trace);
  };

  constructor(
    public message: string, 
    public info?: CharStream.Info, 
    public trace?: StackTraceType
  ) {};

  toString() {
    return this.message;
  }
}


/**
 * Return whether evaluation failed.
 */
export const didEvalFail = <T>(form: EvalResult<T>): form is EvalFailure => (
  form instanceof EvalFailure
);


/**
 * Return whether evaluation succeeded.
 */
export const didEvalSucceed = <T>(form: EvalResult<T>): form is T => (
  !(form instanceof EvalFailure)
);
