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
  (result: EvalResult<any>, ...fns: ((a: any) => EvalResult<any>)[]) => {
    for (const f of fns) {
      if (didEvalFail(result)) {
        return result;
      }
      result = f(result);
    }
    return result;
  }
);

type M<A> = EvalResult<A>;
type F<A, B> = (a: A) => M<B>;

interface RBind {
  <a, b>(m: M<a>, f: F<a, b>): M<b>;
  <a, b, c>(m: M<a>, f: F<a, b>, g: F<b, c>): M<c>;
  <a, b, c, d>(m: M<a>, f: F<a, b>, g: F<b, c>, h: F<c, d>): M<d>;
  <a, b, c, d, e>(m: M<a>, f: F<a, b>, g: F<b, c>, h: F<c, d>, i: F<d, e>): M<e>;
  <a, b, c, d, e, f>(m: M<a>, f: F<a, b>, g: F<b, c>, h: F<c, d>, i: F<d, e>, j: F<e, f>): M<f>;
  <a, b, c, d, e, f, g>(m: M<a>, f: F<a, b>, g: F<b, c>, h: F<c, d>, i: F<d, e>, j: F<e, f>, k: F<f, g>): M<g>;
}
