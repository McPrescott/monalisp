// -----------------------------------------------------------------------------
// -- UNCATEGORIZED UTILITY
//------------------------------------------------------------------------------


import {curry} from './~hyfns/index';
import {Keyword} from './builtin/keyword';
import {Identifier} from './builtin/identifier';
import {ParseFailure} from './read/parse/parser';


// -- Builtin Extensions -------------------------------------------------------

//@ts-ignore
(Number.empty || Object.defineProperty(Number, 'empty', {
  value: () => (0),
  enumerable: false,
  writable: false
}));

//@ts-ignore
(String.empty || Object.defineProperty(String, 'empty', {
  value: () => (""),
  enumerable: false,
  writable: false
}));

//@ts-ignore
(Array.empty || Object.defineProperty(Array, 'empty', {
  value: () => ([]),
  enumerable: false,
  writable: false
}));



// -- Array Functions ----------------------------------------------------------


/**
 * Return the first element of *list*.
 */
export const head = <T>(list: T[]): T => (
  list[0]
);


/**
 * Return new `Array` containing all but the first element of *list*.
 */
export const tail = <T>(list: T[]): T[] => (
  list.filter((_, i) => i !== 0)
);




// -- Misc Functions -----------------------------------------------------------


export const invertPred = curry((predicate: UnaryPred<any>, value: any) => (
  !(predicate(value))
));



// -- Temp ---------------------------------------------------------------------


export const quote = (str: string) => `"${str}"`;


const mapArgs = (arg): string => {
  if (Array.isArray(arg)) {
    return `(${arg.map(mapArgs).join(' ')})`;
  }
  else if (typeof arg === 'string') {
    return (arg.startsWith('! '))
      ? arg.slice(2)
      : quote(arg);
  }
  else if (arg instanceof ParseFailure) {
    return `\n  ${arg.toString().replace(/\n/g, '\n  ')}`;
  }
  else if (arg instanceof Identifier) {
    return `'${arg.name}`;
  }
  else if (arg instanceof Keyword) {
    return arg.key;
  }
  else if (arg instanceof Map) {
    let str = String.empty();
    let i = 0;
    for (const pair of arg) {
      str += pair.map(mapArgs).join(' => ');
      if (++i < arg.size)
        str += ', ';
    }
    return `{${str}}`;
  }
  else if (arg === null) {
    return 'nil';
  }
  return arg.toString();
};


export const log = (...args) => {
  let transformed = args.map(mapArgs);
  console.log(...transformed);
};