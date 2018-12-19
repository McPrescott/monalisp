// -----------------------------------------------------------------------------
// -- PROCEDURE CLASS
//------------------------------------------------------------------------------


/**
 * Monalisp function class. Has been named `Procedure` to disambiguate from
 * JavaScript's builtin `Function` class.
 */
export class Procedure implements ProcedureType {

  /**
   * Static factory function of `Procedure`.
   */
  static of(signature: TaggedIdentifierType[], body: TaggedReaderForm[]) {
    return new Procedure(signature, body);
  }

  constructor(
    public signature: TaggedIdentifierType[],
    public body: TaggedReaderForm[]
  ) {}
}
