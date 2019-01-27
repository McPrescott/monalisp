// -----------------------------------------------------------------------------
// -- CURRENTLY UNCATEGORIZED HELPERS
//------------------------------------------------------------------------------


import {curry} from '../~hyfns/curry';
import {didEvalFail} from './eval-failure';


// NOTE: `rmap` may be superfluous.

/**
 * Functor map for `EvalResult`.
 */
export const rmap: RMap = curry(
  <A, B>(f: (a: A) => B, result: EvalResult<A>): EvalResult<B> => (
    didEvalFail(result)? result : f(result)
  )
);

interface RMap {
  <A, B>(f: (a: A) => B, result: EvalResult<A>): EvalResult<B>;
  <A, B>(f: (a: A) => B): (result: EvalResult<A>) => EvalResult<B>;
}


/**
 * Monadic bind for `EvalResult`.
 */
export const rbind: RBind = curry(
  <A, B>(result: EvalResult<A>, f: (a: A) => EvalResult<B>): EvalResult<B> => (
    didEvalFail(result)? result : f(result)
  )
);

interface RBind {
  <A, B>(result: EvalResult<A>, f: (a: A) => EvalResult<B>): EvalResult<B>;
  <A, B>(result: EvalResult<A>): (f: (a: A) => EvalResult<B>) => EvalResult<B>;
}
