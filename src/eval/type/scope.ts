// -----------------------------------------------------------------------------
// -- ID TABLE
//------------------------------------------------------------------------------


import {last} from '../../~hyfns/list';
import { nil } from '../../common/variable';


type IdAndVar = [IdentifierType, VarType];
type StringAndVar = [string, VarType];


/**
 * Return list where `Identifier` is replaced with its name property in each
 * tuple.
 */
const nameOfIDs = (
  (entries: Iterable<IdAndVar>): StringAndVar[] => {
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
   * Static factory function of `Scope`.
   */
  static of(entries?: Iterable<IdAndVar>): ScopeType {
    return new Scope(entries);
  }

  private table: Map<string, VarType>;
  constructor(entries?: Iterable<IdAndVar>) {
    this.table = (entries) ? new Map(nameOfIDs(entries)) : new Map();
  }

  get size(): number {
    return this.table.size;
  }

  resolve(id: IdentifierType): VarType {
    return this.table.get(id.name) || nil;
  }

  define(id: IdentifierType, value: VarType): VarType {
    this.table.set(id.name, value);
    return value;
  }

  isDefined(id: IdentifierType): boolean {
    return this.table.has(id.name);
  }
}



/**
 * Stack of `Scope` instances, each representing a single scope.
 */
export class ScopeStack implements ScopeStackType {

  /**
   * Static factory function of `ScopeStack`.
   */
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
  
  resolve(id: IdentifierType): VarType {
    for (let i=this.stack.length-1; i>=0; i--) {
      const scope = this.stack[i];
      if (scope.isDefined(id)) {
        return scope.resolve(id);
      }
    }
    return nil;
  };
  
  define(id: IdentifierType, value: VarType): VarType {
    return last(this.stack).define(id, value);
  };
  
  isDefined(id: IdentifierType): boolean {
    return this.stack.some((scope) => scope.isDefined(id));
  };
}

