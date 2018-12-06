// -----------------------------------------------------------------------------
// -- STRING PARSERS
//------------------------------------------------------------------------------


import {map} from '../../~functional/map';
import {isChar, isWhitespace} from "../common/predicates";
import {join} from '../common/transformers';
import {ParseFailure, Parser, Result, pmap} from "../parser";
import {seq, star, plus, skip, pjoin} from './combinators';


/**
 * Return character `Parser`, that succeeds according to *predicate*.
 */
export const satisfy = (
  (predicate: (char: string) => boolean, label='satisfy') => (
    Parser.of((stream): Result<string> => {
      if (predicate(stream.peek()))
        return stream.next();
      const message = `"${stream.peek()}" does not satisfy given predicate.`;
      return ParseFailure.of(message, label, stream.info);
    }, label)
  )
);


/**
 * Return character `Parser` that parses given *char*.
 */
export const pchar = (char: string, label=char) => (
  satisfy(isChar(char), label)
);


/**
 * Return `Parser` that parses given *searchString*.
 */
export const pstring = (
  (searchString: string, label=searchString): Parser<string> => (
    pjoin(seq(map(pchar, searchString), label))
  )
);


/**
 * Parse zero or more whitespace characters.
 */
export const anySpace = (
  pmap(join, star(satisfy(isWhitespace), 'any whitespace'))
);


/**
 * Parse one or more whitespace characters.
 */
export const someSpace = (
  pmap(join, plus(satisfy(isWhitespace), 'some whitespace'))
);


/**
 * Parses zero or more whitespace characters, throwing away results.
 */
export const skipAnySpace = skip(anySpace, 'skip any space');


/**
 * Parses one or more whitespace characters, throwing away results.
 */
export const skipSomeSpace = skip(someSpace, 'skip some space');
