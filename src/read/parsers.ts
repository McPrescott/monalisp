import {is, map, not} from 'ramda';
import {curry, pipe} from '../~functional';
import {Failure} from '../base';
import {isStr, log, Unary, Binary, UnaryPred} from '../util';
import {charRange, emptyString, isChar, toInt} from './string-util';
import {CharStream} from './char-stream';


type ParseFn = (stream: CharStream) => Result;
type Result = any | ParseFailure;



/**
 * Parsing failure type.
 */
export class ParseFailure extends Failure{

  static of(message: string) {
    return new ParseFailure(message);
  }

  constructor(public message: string) {
    super();
  }
}



/**
 * Type wrapper around a parser function.
 */
export class Parser {
  
  /**
   * Return `Parser` that ignores given *stream* and returns given *value*.
   */
  static return(value: any) {
    return Parser.of((stream) => value );
  }

  /**
   * Static constructor function.
   */
  static of(run: ParseFn): Parser {
    return new Parser(run);
  }

  constructor(public run: ParseFn) {};

  /**
   * Return wrapping `Parser` that maps *fn* over successfully parsed value.
   */
  map(fn: Unary): Parser {
    return Parser.of((stream) => {
      const result = run(this, stream);
      return (is(ParseFailure, result)) ? result : fn(result);
    });
  }

  /**
   * Return `Parser` that applies the successful result of *parser* to the
   * successful result of *this*.
   */
  apply(parser: Parser): Parser {
    return Parser.of((stream) => {
      const thisResult = run(this, stream);
      if (is(ParseFailure, thisResult))
        return thisResult;
      const parserResult = run(parser, stream);
      return (is(ParseFailure, parserResult)
        ? parserResult 
        : thisResult(parserResult));
    });
  }
}



/**
 * Test if given argument extends `ParseFailure`.
 */
export const didParseFail: UnaryPred<Result> = is(ParseFailure);


/**
 * Test if given argument does not extend `ParseFailure`.
 */
export const didParseSucceed: UnaryPred<Result> = pipe(didParseFail, not);


/**
 * Run *parser* with given *stream*.
 */
export const run = curry((parser: Parser, stream: CharStream) => 
  parser.run(stream)
);


/**
 * Map *fn* over given *parser*.
 */
export const parMap = curry((fn: Unary, parser: Parser) => (
  parser.map(fn)
));


/**
 * Apply *arg* to contained function of *parser*.
 */
export const parApply = curry((arg, parser: Parser) => (
  parser.apply(arg)
));


/**
 * Return single character parser.
 */
export const pchar = (char: string) => (
  Parser.of((stream: CharStream) => {
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
    let parsed = emptyString;
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
    return (didParseSucceed(result)) ? result : emptyString;
  })
);



const liftTwo = curry((fn: Binary, x: Parser, y: Parser) => (
  Parser.return(fn).apply(x).apply(y)
));

const add = curry((x: number, y: number) => x + y);


const pLower = anyOf(charRange('a', 'z'));
const pDigit = anyOf(charRange('0', '9'));
const optIntSign = opt(pchar('-'));
const anyInt = andThen([optIntSign, oneOrMore(pDigit)]);
const pInt = parMap(toInt, anyInt);
const addP = liftTwo(add)


const source = '-561 100';
const stream = new CharStream(source);
const parser = pInt;
const result = run(parser, stream);

log('! Parsed:', result);
log('! Remain:', stream.rest);
