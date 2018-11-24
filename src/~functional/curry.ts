/**
 * Return curried equivalent to provided function *fn*.
 */
export const curry: Curry = (fn) => {
  const arity = fn.length;
  
  return function inner(...args){
    if (args.length >= arity)
      return fn.apply(null, args);
    
    return (...moreArgs) => inner(...args, ...moreArgs);
  }
}



export interface Curry {
  <T extends any[], R>(func: (...args: T) => R): {
    1: CurriedOne<T[0], R>;
    2: CurriedTwo<T[0], T[1], R>;
    3: CurriedThree<T[0], T[1], T[2], R>;
    4: CurriedFour<T[0], T[1], T[2], T[3], R>;
    5: CurriedFive<T[0], T[1], T[2], T[3], T[4], R>;
    6: CurriedSix<T[0], T[1], T[2], T[3], T[4], T[5], R>;
    7: (...args: any[]) => any;
  }[T extends [any]? 1
  : T extends [any, any]? 2
  : T extends [any, any, any]? 3
  : T extends [any, any, any, any]? 4
  : T extends [any, any, any, any, any]? 5
  : T extends [any, any, any, any, any, any]? 6 : 7];
}


export interface CurriedOne<T1, R> {
  (arg: T1): R;
}


export interface CurriedTwo<T1, T2, R> {
  (arg: T1): CurriedOne<T2, R>;
  (...args: [T1, T2]): R;
}


export interface CurriedThree<T1, T2, T3, R> {
  (arg: T1): CurriedTwo<T2, T3, R>;
  (...args: [T1, T2]): CurriedOne<T3, R>;
  (...args: [T1, T2, T3]): R;
}


export interface CurriedFour<T1, T2, T3, T4, R> {
  (arg: T1): CurriedThree<T2, T3, T4, R>;
  (...args: [T1, T2]): CurriedTwo<T3, T4, R>;
  (...args: [T1, T2, T3]): CurriedOne<T4, R>;
  (...args: [T1, T2, T3, T4]): R;
}


export interface CurriedFive<T1, T2, T3, T4, T5, R> {
  (arg: T1): CurriedFour<T2, T3, T4, T5, R>;
  (...args: [T1, T2]): CurriedThree<T3, T4, T5, R>;
  (...args: [T1, T2, T3]): CurriedTwo<T4, T5, R>;
  (...args: [T1, T2, T3, T4]): CurriedOne<T5, R>;
  (...args: [T1, T2, T3, T4, T5]): R;
}


export interface CurriedSix<T1, T2, T3, T4, T5, T6, R> {
  (arg: T1): CurriedFive<T2, T3, T4, T5, T6, R>;
  (...args: [T1, T2]): CurriedFour<T3, T4, T5, T6, R>;
  (...args: [T1, T2, T3]): CurriedThree<T4, T5, T6, R>;
  (...args: [T1, T2, T3, T4]): CurriedTwo<T5, T6, R>;
  (...args: [T1, T2, T3, T4, T5]): CurriedOne<T6, R>;
  (...args: [T1, T2, T3, T4, T5, T6]): R;
}