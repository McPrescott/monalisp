// -----------------------------------------------------------------------------
// -- COMBINATORS
//------------------------------------------------------------------------------


// TODO: isStr -> is(String)?


import {map} from 'ramda';
import {curry} from '../~functional';
import {isStr, UnaryPred} from '../util';
import {Parser, ParseFailure, Result, run, didParseSucceed, didParseFail} from './parser';
import {isChar} from './string-util';


/**
 * Return character `Parser`, that succeeds according to *predicate*.
 */
export const satisfy = (predicate: UnaryPred<string>) => (
  Parser.of((stream) => (
    (predicate(stream.peek()))
      ? stream.next()
      : ParseFailure.of(`"${stream.peek()}" does not satisfy given predicate.`)
  ))
);


/**
 * Return single character parser.
 */
export const pchar = (char: string) => (
  Parser.of((stream) => {
    let next = stream.peek();
    if (isChar(char, next))
      return stream.next();
    return ParseFailure.of(`Failed to parse "${char}"`);
  })
);


/**
 * Sequentially run *parsers*, return parsed string or `ParseFailure`.
 */
export const andThen = (parsers: Parser[]) => (
  Parser.of((stream) => {
    let parsed = String.empty;
    let current: Result;
    for (const parser of parsers) {
      current = run(parser, stream);
      if (current instanceof ParseFailure)
        return current;
      parsed += current;
    }
    return parsed;
  })
);


/**
 * Sequentially run *parsers*, until a parser succeeds or end of list returning
 * the last `ParseFailure`.
 */
export const orElse = (parsers: Parser[]) => (
  Parser.of((stream) => {
    let current: Result;
    for (const parser of parsers) {
      current = run(parser, stream);
      if (isStr(current))
        return current;
    }
    return current;
  })
);


/**
 * Return `Parser` for any of *chars*.
 */
export const anyOf = (chars: string[]): Parser => (
  orElse(map(pchar, chars))
);


/**
 * Return `Parser` of given *searchString*.
 */
export const pstring = (searchString: string): Parser => (
  andThen(map(pchar, searchString))
);


/**
 * Return higher-order `Parser`, which runs *parser* as many times as possible.
 * The returned parser can never fail, zero matches results in an empty string.
 */
export const zeroOrMore = (parser: Parser) => (
  Parser.of((stream) => {
    let result = run(parser, stream);
    let accum = '';
    while (didParseSucceed(result)) {
      accum = accum.concat(result);
      result = run(parser, stream);
    }
    return accum;
  })
);


/**
 * Return higher order `Parser`, running *parser* as many times as possible, but
 * unlike `zeroOrMore`, `ParseFailure` is provided if first parse is
 * unsuccessful.
 */
export const oneOrMore = (parser: Parser) => (
  Parser.of((stream) => {
    let result = run(parser, stream);
    if (didParseFail(result))
      return result;
    let remaining = run(zeroOrMore(parser), stream);
    return result.concat(remaining);
  })
);


/**
 * Return `Parser` that matches zero or one times. Unsuccessful parses return
 * empty string.
 */
export const opt = (parser: Parser) => (
  Parser.of((stream) => {
    let result = run(parser, stream);
    return (didParseSucceed(result)) ? result : String.empty;
  })
);


/**
 * Return `Parser` that, if successful, returns only the result of *right*.
 */
export const pRight = curry((left: Parser, right: Parser) => (
  Parser.of((stream) => {
    const leftResult = run(left, stream);
    return (didParseSucceed(leftResult))
      ? run(right, stream)
      : leftResult;
  })
));


/**
 * Return `Parser` that, if successful, returns only the result of *left*.
 */
export const pLeft = curry((left: Parser, right: Parser) => (
  Parser.of((stream) => {
    const leftResult = run(left, stream);
    if (didParseFail(leftResult))
      return leftResult;
    const rightResult = run(right, stream);
    return (didParseSucceed(rightResult))
      ? leftResult
      : rightResult;
  })
));


/**
 * Return `Parser` that, if successful, returns only the result of *middle*.
 */
export const pBetween = curry((left: Parser, middle: Parser, right: Parser) => (
  pLeft(pRight(left, middle), right)
));
