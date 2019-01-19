// -----------------------------------------------------------------------------
// -- UNCATEGORIZED UTILITY
//------------------------------------------------------------------------------


import {curry} from './~hyfns/index';
import {Keyword} from './common/keyword';
import {Identifier} from './common/identifier';
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




// -- Misc Functions -----------------------------------------------------------


export const invertPred = curry((predicate: UnaryPred<any>, value: any) => (
  !(predicate(value))
));



// -- Temp ---------------------------------------------------------------------


export const quote = (str: string) => `"${str}"`;

export const parens = (str: string) => `(${str})`;

export const curlys = (str: string) => `{${str}}`;

export const idQuote = (str: string) => `'${str}`;

export const keyQuote = (str: string) => `:${str}`;

const join = (list: any[], separator=' ') => list.join(separator);

const pprintMap = (map: Map<any, any>) => {
  const mapPairs: string[] = [];
  for (const pair of map) {
    mapPairs.push(join(pair.map(pprintValues), ' => '));
  }
  return curlys(join(mapPairs, ', '));
}

export const pprintValues = (form: any): string => (
  Array.isArray(form)? parens(join(form.map(pprintValues))):
  form instanceof Identifier? idQuote(form.name):
  form instanceof Keyword? keyQuote(form.key):
  form instanceof Map? pprintMap(form):
  form === null? 'nil':
  form.toString()
);

export const pprint = (arg: any): string => {
  if ('expr' in arg) {
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