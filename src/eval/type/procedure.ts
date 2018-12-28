// -----------------------------------------------------------------------------
// -- PROCEDURE CLASS
//------------------------------------------------------------------------------


import {Callable} from './callable';


/**
 * Monalisp function class. Has been named `Procedure` to disambiguate from
 * JavaScript's builtin `Function` class.
 */
export class Procedure extends Callable implements ProcedureType {

  /**
   * Static factory function of `Procedure`.
   */
  static of(signature: IdentifierType[], body: TaggedReaderForm[]) {
    return new Procedure(signature, body);
  }

  constructor(
    public signature: IdentifierType[],
    public body: TaggedReaderForm[]
  ) { super(); }
}
