import {AnyFn, ReturnOf, ArgsOf} from "../util";

/**
 * Return function that successively chains provided *fns*, passing the return
 * as an argument the return value of the previous function.
 */
export const pipe: Pipe = (first, ...rest) => (
  (...args) => (
    rest.reduce((value, currentFn) => currentFn(value), first(...args))
  )
);



export interface Pipe {

  <F extends AnyFn>(fn0: F): F;

  <F extends AnyFn, R>(first: F, ...fns: [
    (_0: ReturnOf<F>) => R
  ]): (...args: ArgsOf<F>) => R;

  <F extends AnyFn, T0, R>(first: F, ...fns: [
    (_0: ReturnOf<F>) => T0,
    (_1: T0) => R
  ]): (...args: ArgsOf<F>) => R;

  <F extends AnyFn, T0, T1, R>(first: F, ...fns: [
    (_0: ReturnOf<F>) => T0,
    (_1: T0) => T1,
    (_2: T1) => R
  ]): (...args: ArgsOf<F>) => R;

  <F extends AnyFn, T0, T1, T2, R>(first: F, ...fns: [
    (_0: ReturnOf<F>) => T0,
    (_1: T0) => T1,
    (_2: T1) => T2,
    (_3: T2) => R
  ]): (...args: ArgsOf<F>) => R;

  <F extends AnyFn, T0, T1, T2, T3, R>(first: F, ...fns: [
    (_0: ReturnOf<F>) => T0,
    (_1: T0) => T1,
    (_2: T1) => T2,
    (_3: T2) => T3,
    (_4: T3) => R
  ]): (...args: ArgsOf<F>) => R;

  <F extends AnyFn, T0, T1, T2, T3, T4, R>(first: F, ...fns: [
    (_0: ReturnOf<F>) => T0,
    (_1: T0) => T1,
    (_2: T1) => T2,
    (_3: T2) => T3,
    (_4: T3) => T4,
    (_5: T4) => R
  ]): (...args: ArgsOf<F>) => R;

  <F extends AnyFn, T0, T1, T2, T3, T4, T5, R>(first: F, ...fns: [
    (_0: ReturnOf<F>) => T0,
    (_1: T0) => T1,
    (_2: T1) => T2,
    (_3: T2) => T3,
    (_4: T3) => T4,
    (_5: T4) => T5,
    (_6: T5) => R
  ]): (...args: ArgsOf<F>) => R;
}
