// -----------------------------------------------------------------------------
// -- BIND EVALUATION FUNCTION
//------------------------------------------------------------------------------


import {EvalFailure, didEvalFail} from '../eval-failure';


/**
 * Return function that successively chains provided functions, passing as an
 * argument the return value of the previous function, unless that value is of
 * type `EvalFailure`, in which case the failure is returned immediately.
 */
export const bind: Bind = (first, ...rest) => (
  (...args) => {
    let result = first(...args);
    if (didEvalFail(result)) {
      return result;
    }
    for (const fn of rest) {
      result = fn(result);
      if (didEvalFail(result)) {
        return result;
      }
    }
    return result;
  }
);


type ExcludeEvalFailure<T> = Exclude<T, EvalFailureType>;


export interface Bind {

  <F extends AnyFn>(fn0: F): F;

  <F extends AnyFn, R>(first: F, ...fns: [
    (_0: ExcludeEvalFailure<ReturnOf<F>>) => R
  ]): (...args: ArgsOf<F>) => EvalResult<R>;

  <F extends AnyFn, T0, R>(first: F, ...fns: [
    (_0: ExcludeEvalFailure<ReturnOf<F>>) => T0,
    (_1: ExcludeEvalFailure<T0>) => R
  ]): (...args: ArgsOf<F>) => EvalResult<R>;

  <F extends AnyFn, T0, T1, R>(first: F, ...fns: [
    (_0: ExcludeEvalFailure<ReturnOf<F>>) => T0,
    (_1: ExcludeEvalFailure<T0>) => T1,
    (_2: ExcludeEvalFailure<T1>) => R
  ]): (...args: ArgsOf<F>) => EvalResult<R>;

  <F extends AnyFn, T0, T1, T2, R>(first: F, ...fns: [
    (_0: ExcludeEvalFailure<ReturnOf<F>>) => T0,
    (_1: ExcludeEvalFailure<T0>) => T1,
    (_2: ExcludeEvalFailure<T1>) => T2,
    (_3: ExcludeEvalFailure<T2>) => R
  ]): (...args: ArgsOf<F>) => EvalResult<R>;

  <F extends AnyFn, T0, T1, T2, T3, R>(first: F, ...fns: [
    (_0: ExcludeEvalFailure<ReturnOf<F>>) => T0,
    (_1: ExcludeEvalFailure<T0>) => T1,
    (_2: ExcludeEvalFailure<T1>) => T2,
    (_3: ExcludeEvalFailure<T2>) => T3,
    (_4: ExcludeEvalFailure<T3>) => R
  ]): (...args: ArgsOf<F>) => EvalResult<R>;

  <F extends AnyFn, T0, T1, T2, T3, T4, R>(first: F, ...fns: [
    (_0: ExcludeEvalFailure<ReturnOf<F>>) => T0,
    (_1: ExcludeEvalFailure<T0>) => T1,
    (_2: ExcludeEvalFailure<T1>) => T2,
    (_3: ExcludeEvalFailure<T2>) => T3,
    (_4: ExcludeEvalFailure<T3>) => T4,
    (_5: ExcludeEvalFailure<T4>) => R
  ]): (...args: ArgsOf<F>) => EvalResult<R>;

  <F extends AnyFn, T0, T1, T2, T3, T4, T5, R>(first: F, ...fns: [
    (_0: ExcludeEvalFailure<ReturnOf<F>>) => T0,
    (_1: ExcludeEvalFailure<T0>) => T1,
    (_2: ExcludeEvalFailure<T1>) => T2,
    (_3: ExcludeEvalFailure<T2>) => T3,
    (_4: ExcludeEvalFailure<T3>) => T4,
    (_5: ExcludeEvalFailure<T4>) => T5,
    (_6: ExcludeEvalFailure<T5>) => R
  ]): (...args: ArgsOf<F>) => EvalResult<R>;
}

