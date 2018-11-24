import {curry, map} from 'ramda';
import Failure from '../base/failure';
import {isStr, log} from '../util';
import {charRange, empty, is} from './string-util';
import {CharStream} from './char-stream';



/**
 * Parsing failure type.
 */
export class ParseFailure extends Failure{

  static of(message: string) {
    return new ParseFailure(message);
  }

  constructor(public message: string) {
    super(message);
  }
}



type Parse<T=string> = (stream: CharStream) => Result<T>;
type Result<T=string> = T | ParseFailure;



/**
 * Type wrapper around a parser function.
 */
export class Parser<T=string> {
  
  static of<T>(run: Parse<T>): Parser<T> {
    return new Parser(run);
  }

  constructor(public run: Parse<T>) {};
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
    if (is(char, next))
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
    let current: string | ParseFailure;
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
    let current: string | ParseFailure;
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
export const anyOf = (chars: string[]) => (
  orElse(map(pchar, chars))
);


const pLower = anyOf(charRange('a', 'z'));
const pDigit = anyOf(charRange('0', '9'));

const source = 'l9ma';
const stream = new CharStream(source);
const parser = andThen([pLower, pDigit]);
const result = run(parser, stream);

log(result);
