// -----------------------------------------------------------------------------
// -- MONALISP READER
//------------------------------------------------------------------------------


import {Identifier} from '../builtin/identifier';
import {Keyword} from '../builtin/keyword';
import {DBL_QUT, OPEN_PAREN, CLOSE_PAREN, OPEN_CURLY, CLOSE_CURLY, COLON} from './parse/common/chars';
import {matches, isChar, invert} from './parse/common/predicates';
import {CharStream} from './parse/char-stream';
import {run, pmap, plabel} from './parse/parser';
import {pjoin, seq, star, skip, choice, between, series, fref, pair, after, plus, pjoinFlat, completion} from './parse/parsers/combinators';
import {satisfy, pchar, anySpace, someSpace, satisfyRegex} from './parse/parsers/string';
import {parseFloat} from './parse/parsers/numeric';
import {log} from '../util';


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


export namespace Id {
  const begin = /[a-z+\-*/=<>&|!?$_]/i;
  const contain = /[a-z0-9+\-*/=<>&|!?$_]/i;

  const table: {[key: string]: Identifier} = Object.create(null);

  const getIdentifier = (name: string) => (
    (name in literals)
      ? literals[name]
      : (name in table)
        ? table[name]
        : (table[name] = Identifier.of(name))
  );

  export const parser = pmap(getIdentifier, pjoin(
    seq([
      satisfy(matches(begin)),
      pjoin(star(satisfy(matches(contain))))
    ], 'symbol')
  ));
}


export namespace Key {
  const label = plabel('keyword');
  const pcolon = pchar(COLON);
  const validChars = satisfyRegex(/[a-z0-9+\-*/=<>&|!?$_]/i);
  const keyString = pjoinFlat(pair(pcolon, plus(validChars)));

  export const table: {[key: string]: Keyword} = Object.create(null);

  export const getKey = (key: string) => (
    (key in table) 
      ? table[key]
      : (table[key] = Keyword.of(key))
  );

  export const parser = label(pmap(getKey, keyString));
}


export namespace Atom {
  export const parser = choice([
    Num.parser,
    Str.parser,
    Id.parser,
    Key.parser
  ]);
}


export namespace SExpr {
  export const [ref, parser] = fref<SExpr>();
}


export namespace List {
  const label = plabel('list');
  const popen = seq([pchar(OPEN_PAREN), anySpace], 'open paren');
  const pclose = seq([anySpace, pchar(CLOSE_PAREN)], 'close paren');
  const contents = series(SExpr.parser, someSpace);
  export const parser = label(between(popen, contents, pclose));
}


export namespace Dict {
  const label = plabel('map');
  const popen = seq([pchar(OPEN_CURLY), anySpace], 'open curly');
  const pclose = seq([anySpace, pchar(CLOSE_CURLY)], 'close curly');
  const kvpair = pair(SExpr.parser, after(someSpace, SExpr.parser));
  const someSpaceOrComma = plus(satisfyRegex(/\s|,/));
  const kvpairs = series(kvpair, someSpaceOrComma);
  const mapOf = (kvpairs: [any, any][]) => new Map(kvpairs);
  export const parser = label(pmap(mapOf, between(popen, kvpairs, pclose)));
}


SExpr.ref.parser = choice([
  Atom.parser,
  List.parser,
  Dict.parser
], 's-expression');


const monalispParser = completion(after(anySpace, SExpr.parser));


/**
 * Parse given Monalisp *code*.
 */
export const read = (code: string) => (
  run(monalispParser, CharStream.of(code))
);
