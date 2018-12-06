// -----------------------------------------------------------------------------
// -- MONALISP READER
//------------------------------------------------------------------------------


import {DBL_QUT} from './common/chars';
import {matches, isChar, invert} from './common/predicates';
import {CharStream} from './char-stream';
import {run, pmap} from './parser';
import {pjoin, seq, star, skip, choice, pmapTo, attempt} from './parsers/combinators';
import {satisfy, pchar, pstring} from './parsers/string';
import {parseFloat} from './parsers/numeric';
import {log} from '../util';

/// `true`, `false`, `null`, etc. can be kept in a symbol table, or should these
/// be interpreted by the reader and be converted into their corresponding
/// values before being sent for evaluation?

// Nil
// Bool
// Sym 
// Str
// Num


namespace Nil {
  export const parser = attempt(pmapTo(pstring('nil'), null));
}


namespace Bool {
  const ptrue = pmapTo(pstring('true'), true);
  const pfalse = pmapTo(pstring('false'), false);
  export const parser = choice([
    attempt(ptrue),
    attempt(pfalse)
  ], 'boolean');
}


namespace Num {
  export const parser = parseFloat;
}


namespace Str {
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


namespace Sym {
  const begin = /[a-z+\-*/=@&|!?$_]/i;
  const contain = /[a-z0-9+\-*/=@&|!?$_]/i;


  const table: {[key: string]: Symbol} = {};


  const getSymbol = (identifier: string) => (
    (identifier in table)
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


namespace Atom {
  export const parser = choice([
    Nil.parser,
    Bool.parser,
    Num.parser,
    Str.parser,
    Sym.parser
  ]);
}


const source = 'falsz "a string" 100.12 with some remaining text';
const stream = CharStream.of(source);
const result = run(Atom.parser, stream);
const remaining = stream.rest;


log('! Result:', result);
log('! Remain:', remaining);
