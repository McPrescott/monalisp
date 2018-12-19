// -----------------------------------------------------------------------------
// -- SPECIAL FORM CLASS
//------------------------------------------------------------------------------


type SpecialFormBody<T extends TaggedReaderForm[], U extends EvalForm> = (
  (scope: ScopeStackType, arglist: T) => EvalResult<U>
);


/**
 * Monalisp's `SpecialForm` class.
 */
export class SpecialForm<T extends TaggedReaderForm[], U extends EvalForm> implements SpecialFormType {

  /**
   * Static factory function of `SpecialForm`.
   */
  static of<T extends TaggedReaderForm[], U extends EvalForm>
  (body: SpecialFormBody<T, U>) {
    return new SpecialForm(body);
  }

  constructor(public body: SpecialFormBody<T, U>) {}
}
