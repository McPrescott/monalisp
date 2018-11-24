import {Curry} from "../typings/curry";

export const curry: Curry = (fn) => {
  const arity = fn.length;
  
  return function inner(...args){
    if (args.length >= arity)
      return fn.apply(null, args);
    
    return (...moreArgs) => inner(...args, ...moreArgs);
  }
}