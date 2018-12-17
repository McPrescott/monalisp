// -----------------------------------------------------------------------------
// -- ID TABLE
//------------------------------------------------------------------------------


import {last} from '../~hyfns/last';


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
export class Scope implements ScopeType {

  /**
   * Static factory function of `VarTable`.
   */
  static of(entries?: Iterable<[IdentifierType, EvalForm]>): ScopeType {
    return new Scope(entries);
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



/**
 * Stack of `VarTable` instances, each representing a single scope.
 */
export class ScopeStack implements ScopeStackType {

  static of(stack: Iterable<ScopeType>): ScopeStackType {
    return new ScopeStack(stack);
  }

  private readonly stack: ScopeType[];
  constructor(stack: Iterable<ScopeType>) {
    this.stack = Array.of(...stack);
  }

  [Symbol.iterator]() {
    return this.stack[Symbol.iterator]();
  }

  push(...scopes: ScopeType[]): ScopeStackType {
    return ScopeStack.of(this.stack.concat(scopes));
  };

  pop(): ScopeStackType {
    return ScopeStack.of(this.stack.slice(0, -1));
  };
  
  resolve(id: IdentifierType): EvalForm {
    let resolved: EvalForm;
    for (const scope of this.stack) {
      if (scope.isDefined(id))
        resolved = scope.resolve(id);
        break;
    }
    return resolved;
  };
  
  define(id: IdentifierType, value: EvalForm): EvalForm {
    return last(this.stack).define(id, value);
  };
  
  isDefined(id: IdentifierType): boolean {
    return this.stack.some((scope) => scope.isDefined(id));
  };
}

