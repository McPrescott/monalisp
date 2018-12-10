// -----------------------------------------------------------------------------
// -- UNCATEGORIZED UTILITY
//------------------------------------------------------------------------------


import {curry} from './~hyfns/index';
import {Keyword} from './builtin/keyword';
import {Identifier} from './builtin/identifier';
import {ParseFailure} from './read/parse/parser';


// -- Builtin Extensions -------------------------------------------------------

//@ts-ignore
Object.defineProperty(Number, 'empty', {
  value: () => (0),
  enumerable: false,
  writable: false
});

//@ts-ignore
Object.defineProperty(String, 'empty', {
  value: () => (""),
  enumerable: false,
  writable: false
});

//@ts-ignore
Object.defineProperty(Array, 'empty', {
  value: () => ([]),
  enumerable: false,
  writable: false
});




// -- Misc Functions -----------------------------------------------------------


export const isStr = (value: any) => typeof value === 'string';



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