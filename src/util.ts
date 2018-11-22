import {Curry} from './typings/curry';
import {Pipe} from './typings/pipe';



// -- Function Types -----------------------------------------------------------

export type AnyFn = (...args: any[]) => any;
export type Unary<T=any, R=T> = (arg: T) => R;
export type Pred<T=any> = (arg: T) => boolean;
export type ArgType<T extends AnyFn> = (
  T extends ((...x: infer A) => any) ? A : never
);


// -- Misc Functions -----------------------------------------------------------


export const curry: Curry = (fn) => {
  const arity = fn.length;
  
  return function inner(...args: any[]){
    if (args.length >= arity)
      return fn.apply(null, args);
    
    return (...moreArgs: any[]) => inner(...args, ...moreArgs);
  };
};


export const pipe: Pipe = (...fns) => (arg: any) => (
  fns.reduce((prev, current) => current(prev), arg)
);


export const invertPredicate = curry(
  (predicate: Pred, arg: any) => (
    !predicate(arg)
  )
);


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