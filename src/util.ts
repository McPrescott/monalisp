// -----------------------------------------------------------------------------
// -- UNCATEGORIZED UTILITY
//------------------------------------------------------------------------------


import {curry, is, not} from 'ramda';
import {Failure} from './base';
import {ParseFailure} from './read/parser';
import {Sym} from './read/reader';



// -- Function Types -----------------------------------------------------------


export type AnyFn = (...args: any[]) => any;
export type Unary<T=any, R=T> = (arg: T) => R;
export type Binary<T0=any, T1=T0, R=T0> = (...args: [T0, T1]) => R;
export type Ternary<T0=any, T1=T0, T2=T0, R=T0> = (...args: [T0, T1, T2]) => R;
export type UnaryPred<T> = (arg: T) => boolean;
export type GenericPred = <T extends any[]>(...args: T) => boolean;
export type ArgsOf<T extends AnyFn> = (
  T extends ((...x: infer A) => any) ? A : never
);
export type ReturnOf<T extends AnyFn> = (
  T extends ((...x: any[]) => (infer R)) ? R : never
);



// -- Builtin Extensions -------------------------------------------------------


// @ts-ignore
Number.empty = Number.prototype.empty = 0;

// @ts-ignore
String.empty = String.prototype.empty = '';

// @ts-ignore
Array.empty = Array.prototype.empty = [];




// -- Misc Functions -----------------------------------------------------------


export const isStr = (value: any) => typeof value === 'string';


export const isFailure = is(Failure);


export const invertPred = curry((predicate: UnaryPred<any>, value: any) => (
  not(predicate(value))
));



// -- Temp ---------------------------------------------------------------------


export const quote = (str: string) => `"${str}"`;


const mapArgs = (arg) => {
  if (Array.isArray(arg)) {
    return `(${arg.map(mapArgs).join(' ')})`;
  }
  else if (typeof arg === 'string') {
    return (arg.startsWith('! '))
      ? arg.slice(2)
      : quote(arg);
  }
  else if (arg instanceof ParseFailure) {
    return `\n  ${arg.toString().replace(/\n/g, '\n  ')}`
  }
  else if (arg instanceof Sym.Symbol) {
    return `$(${arg.identifier})`;
  }
  else if (arg === null) {
    return 'nil'
  }
  return arg;
}

export const log = (...args) => {
  let transformed = args.map(mapArgs);
  console.log(...transformed);
};