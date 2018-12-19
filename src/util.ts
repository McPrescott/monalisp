// -----------------------------------------------------------------------------
// -- UNCATEGORIZED UTILITY
//------------------------------------------------------------------------------


import {curry} from './~hyfns/index';
import {Keyword} from './common/keyword';
import {Identifier} from './common/identifier';
import {ParseFailure} from './read/parse/parser';
import {ReaderTag} from './read/tagging';


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




// -- Misc Functions -----------------------------------------------------------


export const invertPred = curry((predicate: UnaryPred<any>, value: any) => (
  !(predicate(value))
));



// -- Temp ---------------------------------------------------------------------


export const quote = (str: string) => `"${str}"`;


export const pprint = (arg: any): string => {
  if (arg instanceof ReaderTag) {
    return pprint(arg.expression);
  }
  else if (Array.isArray(arg)) {
    return `(${arg.map(pprint).join(' ')})`;
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
      str += pair.map(pprint).join(' => ');
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


export const log = (...args: any[]) => {
  let transformed = args.map(pprint);
  console.log(...transformed);
};