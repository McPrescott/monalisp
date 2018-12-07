// -----------------------------------------------------------------------------
// -- MONALISP READER
//------------------------------------------------------------------------------


import {DBL_QUT, OPEN_PAREN, CLOSE_PAREN} from './common/chars';
import {matches, isChar, invert} from './common/predicates';
import {CharStream} from './char-stream';
import {run, pmap, plabel} from './parser';
import {pjoin, seq, star, skip, choice, between, series, fref} from './parsers/combinators';
import {satisfy, pchar, anySpace, someSpace} from './parsers/string';
import {parseFloat} from './parsers/numeric';
import {log} from '../util';

/// `true`, `false`, `null`, etc. can be kept in a symbol table, or should these
/// be interpreted by the reader and be converted into their corresponding
/// values before being sent for evaluation?

const literals = {
  nil: null,
  true: true,
  false: false
};


export namespace Num {
  export const parser = parseFloat;
}


export namespace Str {
  const skipQuote = skip(pchar(DBL_QUT));
  const notQuote = satisfy(invert(isChar(DBL_QUT)));

  export const parser = pjoin(
    seq([
      skipQuote,
      pjoin(star(notQuote)),
      skipQuote
    ], 'string')
  );
}


export namespace Sym {
  const begin = /[a-z+\-*/=<>&|!?$_]/i;
  const contain = /[a-z0-9+\-*/=<>&|!?$_]/i;


  const table: {[key: string]: Symbol} = {};


  const getSymbol = (identifier: string) => (
    (identifier in literals)
      ? literals[identifier]
      : (identifier in table)
        ? table[identifier]
        : (table[identifier] = Symbol.of(identifier))
  );


  export class Symbol {
    static of(identifier: string) {
      return new Symbol(identifier);
    }
    
    constructor(public readonly identifier: string) {}
    
    toString() {
      return this.identifier;
    }
  }

  export const parser = pmap(getSymbol, pjoin(
    seq([
      satisfy(matches(begin)),
      pjoin(star(satisfy(matches(contain))))
    ], 'symbol')
  ));
}


export namespace Atom {
  export const parser = choice([
    Num.parser,
    Str.parser,
    Sym.parser
  ]);
}


export namespace SExpr {
  export const [ref, parser] = fref();
}


// for now, a list cannot contain other lists, only atoms.
export namespace List {
  const label = plabel('list');
  const popen = seq([pchar(OPEN_PAREN), anySpace], 'open paren');
  const pclose = seq([anySpace, pchar(CLOSE_PAREN)], 'close paren');
  const contents = series(SExpr.parser, someSpace);
  export const parser = label(between(popen, contents, pclose));
}



SExpr.ref.parser = choice([
  Atom.parser,
  List.parser
], 's-expression');


const source = '(true nil nilz false (100.12 99 lol)) with some remaining text';
const stream = CharStream.of(source);
const result = run(List.parser, stream);
const remaining = stream.rest;


log('! Result:', result); 
log('! Remain:', remaining);
