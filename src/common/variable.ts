// -----------------------------------------------------------------------------
// -- VARIABLE CLASS
//------------------------------------------------------------------------------


import {formFlagOf} from './form-flag';


/**
 * Create new `VarType` with given *expr*, *src*.
 */
export const variable = (
  <T extends FormType>
  (expr: T, src: CharStream.State): VarOf<T> => (
    {expr, src, type: formFlagOf(expr)} as VarOf<T>
  )
);


/**
 * Lift arbitrary form within `VarType`.
 */
export const vlift = <T extends FormType>(expr: T): VarOf<T> => (
  variable(expr, null)
);


/**
 * Return a new `VarType` with given *expr*
 */
export const variableFrom = (
  <T extends FormType>(expr: T, {src, type}: VarOf<T>) => (
    {expr, src, type}
  )
);


/**
 * Return new `VarType` from mapping *fn* over the `expr` property of `VarType`
 * given.
 */
export const vmap = (
  <T extends FormType, U extends FormType>
  ({expr, src}: VarOf<T>, fn: (expr: T) => U): VarOf<U> => (
    variable(fn(expr as T), src)
  )
);


/**
 * Return new `VarType` with given *src*.
 */
export const vsrc = (
  <T extends VarType>({expr}: T, src: CharStream.State): T => (
    variable(expr, src) as T
  )
);


/**
 * Apply forms from a list of `VarType`, to given *fn*.
 */
export const applyForms = (
  <T>(vars: VarType[], fn: (...forms: FormType[]) => T) => (
    fn(...vars.map(v => v.expr))
  )
);


/**
 * Return an adapted function that accepts `VarType` instead of `FormType`.
 */
export const withForms = (
  <T extends FormType[], U>
  (fn: (...forms: T) => U) => (...vars: VarType[]): U => (
    fn(...vars.map(v => v.expr) as T)
  )
);


/**
 * Monalisp nil value.
 */
export const nil: NilVar = vlift(null) as NilVar;
