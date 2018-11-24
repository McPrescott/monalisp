import {curry, is, map} from 'ramda';
import {Failure} from '../base';
import {isStr, log, Unary, Binary} from '../util';
import {charRange, empty, isChar, toInt} from './string-util';
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
      const result = run(this, stream);
      return result(run(parser, stream));
    });
  }
}


/**
 * Run *parser* with given *stream*.
 */
export const run = curry((parser: Parser, stream: CharStream) => 
  parser.run(stream)
);


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
    let parsed = empty;
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


const liftTwo = curry((fn: Binary, x, y) => (
  Parser.return(fn).apply(x).apply(y)
));


const add = curry((x: number, y: number) => x + y);

const addP = liftTwo(add)

const pLower = anyOf(charRange('a', 'z'));
const pDigit = anyOf(charRange('0', '9'));
const pInt = pDigit.map(toInt);


const source = '58this and some more words';
const stream = new CharStream(source);
const parser = addP(pInt, pInt);
const result = run(parser, stream);

log(result);
