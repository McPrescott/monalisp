import {curry, is, not} from 'ramda';
import {Failure} from './base';


// -- Function Types -----------------------------------------------------------

export type AnyFn = (...args: any[]) => any;
export type Unary<T=any, R=T> = (arg: T) => R;
export type Binary<T0=any, T1=T0, R=T0> = (...args: [T0, T1]) => R;
export type Ternary<T0=any, T1=T0, T2=T0, R=T0> = (...args: [T0, T1, T2]) => R;
export type UnaryPred<T> = (arg: T) => boolean;
export type GenericPred = <T extends any[]>(...args: T) => boolean;
export type ArgType<T extends AnyFn> = (
  T extends ((...x: infer A) => any) ? A : never
);



// -- Misc Functions -----------------------------------------------------------


export const isStr = (value: any) => typeof value === 'string';


export const isFailure = is(Failure);


export const invertPred = curry((predicate: UnaryPred<any>, value: any) => (
  not(predicate(value))
));



// -- Temp ---------------------------------------------------------------------


export const quote = (str: string) => `"${str}"`;


export const log = (...args) => {
  args.forEach((arg) => {
    if (typeof arg === 'string') {
      return console.log(quote(arg));
    }
    console.log(arg);
  })
};