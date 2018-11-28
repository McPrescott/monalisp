// -----------------------------------------------------------------------------
// -- COMBINATORS
//------------------------------------------------------------------------------


// TODO: isStr -> is(String)?


import {map} from 'ramda';
import {curry} from '../~functional';
import {isStr, UnaryPred} from '../util';
import {Parser, ParseFailure, Result, run, didParseSucceed, didParseFail, labelledParser} from './parser';
import {isChar} from './string-util';


/**
 * Return character `Parser`, that succeeds according to *predicate*.
 */
export const satisfy = (predicate: UnaryPred<string>, label?: string) => (
  Parser.of((stream): Result<string> => {
    if (predicate(stream.peek()))
      return stream.next();
    let message = `"${stream.peek()}" does not satisfy given predicate.`;
    return ParseFailure.of(message, label, stream.info);
  }, label)
);


/**
 * Return single character parser.
 */
export const parseChar = (char: string): Parser<string> => (
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
 * only the last `ParseFailure`.
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
  orElse(map(parseChar, chars))
);


/**
 * Return `Parser` of given *searchString*.
 */
export const parseString = (searchString: string): Parser<string> => (
  andThen(map(parseChar, searchString))
);


/**
 * Return higher-order `Parser`, which runs *parser* as many times as possible.
 * The returned parser can never fail, zero matches returns an empty list.
 */
export const zeroOrMore = <T>(parser: Parser<T>): Parser<T[]> => (
  Parser.of((stream) => {
    let results = [];
    let currentResult: Result<T>;
    while (didParseSucceed(currentResult = run(parser, stream))) {
      results.push(currentResult);
    }
    return results;
  })
);


/**
 * Return higher order `Parser`, running *parser* as many times as possible, but
 * unlike `zeroOrMore`, `ParseFailure` is provided if first parse is
 * unsuccessful.
 */
export const oneOrMore = <T>(parser: Parser<T>, label?:string): Parser<T[]> => {
  return labelledParser((stream) => {
    let result = run(parser, stream); 
    if (didParseFail(result)) {
      return result;
    }
    let results = [result];
    while (didParseSucceed(result = run(parser, stream))) {
      results.push(result);
    }
    return results;
  }, (label || `One or more ${parser.label}`))
}


/**
 * Return `Parser` that matches zero or one times. Unsuccessful parses return
 * empty string.
 */
export const optional = (parser: Parser) => (
  Parser.of((stream) => {
    let result = run(parser, stream);
    return (didParseSucceed(result)) ? result : String.empty;
  })
);


/**
 * Return `Parser` that, if successful, returns only the result of *right*.
 */
export const parseRight = curry((left: Parser, right: Parser) => (
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
export const parseLeft = curry((left: Parser, right: Parser) => (
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
export const parseBetween = curry(
  (left: Parser, middle: Parser, right: Parser) => (
    parseLeft(parseRight(left, middle), right)
  )
);
