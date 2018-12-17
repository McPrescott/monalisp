// -----------------------------------------------------------------------------
// -- ID TABLE
//------------------------------------------------------------------------------


/**
 * Return list where `Identifier` is replaced with its name property in each
 * tuple.
 */
const nameOfIDs = (
  (entries: Iterable<[IdentifierType, EvalForm]>): [string, EvalForm][] => {
    let result = [];
    for (const entry of entries) {
      result.push([entry[0].name, entry[1]]);
    }
    return result;
  }
);



/**
 * Table of stored variables.
 */
export class VarTable implements VarTableType {

  /**
   * Static factory function of `VarTable`.
   */
  static of(entries?: Iterable<[IdentifierType, EvalForm]>): VarTableType {
    return new VarTable(entries);
  }

  private table: Map<string, EvalForm>;
  
  constructor(entries?: Iterable<[IdentifierType, EvalForm]>) {
    this.table = (entries) ? new Map(nameOfIDs(entries)) : new Map();
  }

  /**
   * Resolve value of given *id*.
   */
  resolve(id: IdentifierType): EvalForm {
    return this.table.get(id.name);
  }

  /**
   * Set the value of *id* to *value*.
   */
  define(id: IdentifierType, value: EvalForm): EvalForm {
    this.table.set(id.name, value);
    return value;
  }

  /**
   * Return whether *id* is defined.
   */
  isDefined(id: IdentifierType): boolean {
    return this.table.has(id.name);
  }
}
