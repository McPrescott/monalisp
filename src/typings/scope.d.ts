// -----------------------------------------------------------------------------
// -- EVAL MODULE TYPE DEFINITIONS
//------------------------------------------------------------------------------



// -- Scopes -------------------------------------------------------------------


interface ScopeConstructor {
  of(entries: Iterable<[IdentifierType, VarType]>): ScopeType;
  new(entries: Iterable<[IdentifierType, VarType]>): ScopeType;
  readonly prototype: ScopeType;
}


/**
 * Represents a single scope in a Monalisp program.
 */
interface ScopeType {

  /**
   * Number of bindings within scope.
   */
  readonly size: number;

  /**
   * Resolve value of given *id*.
   */
  resolve(id: IdentifierType): VarType;
  
  /**
   * Set the value of *id* to *value*.
   */
  define(id: IdentifierType, value: VarType): VarType;

  /**
   * Return whether *id* is defined.
   */
  isDefined(id: IdentifierType): boolean;
}


interface ScopeStackConstructor {
  of(scopes: Iterable<ScopeType>): ScopeStackType;
  new(scopes: Iterable<ScopeType>): ScopeStackType;
  readonly prototype: ScopeStackType;
}


/**
 * Represents the current stack of scopes, from global to innermost `Scope`.
 */
interface ScopeStackType extends Iterable<ScopeType> {

  /**
   * Push given *scopes* onto the stack, returning a new `ScopeStack`.
   */
  push(...scopes: ScopeType[]): ScopeStackType;

  /**
   * Pop most innermost `Scope` from the stack, returning the new `ScopeStack`
   * **NOT** the `Scope` itself.
   */
  pop(): ScopeStackType;

  /**
   * Resolve given *id*, returning `null` when undefined.
   */
  resolve(id: IdentifierType): VarType;

  /**
   * Bind given *value* to *id*.
   */
  define(id: IdentifierType, value: VarType): VarType;

  /**
   * Return whether given *id* is defined in any contained `Scope`.
   */
  isDefined(id: IdentifierType): boolean;
}
