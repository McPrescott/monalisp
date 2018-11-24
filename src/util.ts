import {curry, not} from 'ramda';


// -- Function Types -----------------------------------------------------------

export type AnyFn = (...args: any[]) => any;
export type Unary<T=any, R=T> = (arg: T) => R;
export type UnaryPred<T> = (arg: T) => boolean;
export type GenericPred = <T extends any[]>(...args: T) => boolean;
export type ArgType<T extends AnyFn> = (
  T extends ((...x: infer A) => any) ? A : never
);



// -- Misc Functions -----------------------------------------------------------


export const isStr = (value: any) => typeof value === 'string';


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