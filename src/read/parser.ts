// -----------------------------------------------------------------------------
// -- TYPE CLASSES
//------------------------------------------------------------------------------


// TODO: 
//   + Result -> ParseResult?
//   + ParseFn -> ParseFunction | ParseProcedure | ParseMethod??
//   + parLabel: should ParseFailure.info be added??
//   + Write simple ramda functions?


import {is} from 'ramda';
import {curry} from '../~functional';
import {Failure} from '../base';
import {Unary} from '../util';
import {CharStream} from './char-stream';
import {SPACE} from './common/chars';



/**
 * Parse function signature of `Parser`.
 */
export type ParseFn<T=any> = (stream: CharStream) => Result<T>;


/**
 * Result of `ParseFn`.
 */
export type Result<T=any> = T | ParseFailure;



/**
 * Parsing failure type.
 */
export class ParseFailure extends Failure {

  /**
   * Static constructor of `ParseFailure`.
   */
  static of(message: string, label?: string, info?: CharStream.Info) {
    return new ParseFailure(message, label, info);
  }

  constructor(
    public message: string,
    public label="Unknown",
    public info?: CharStream.Info
  ){
    super();
  }

  /**
   * Return error message for parse failure.
   */
  toString() {
    const {message, label, info: {lineText, line, column}} = this;
    return (
      `Failed to parse ${label}.\n`
    + `line: ${line}, column ${column}\n`
    + `  ${lineText}\n`
    + `  ${SPACE.repeat(column)}^ ${message}`
    );
  }
}



/**
 * Type wrapper around a parser function.
 */
export class Parser<T=any> {
  
  /**
   * Return `Parser` that ignores given *stream* and returns given *value*.
   */
  static return<T>(value: T): Parser<T> {
    return Parser.of((stream) => value);
  }

  /**
   * Static constructor function.
   */
  static of<T>(run: ParseFn<T>, label?: string): Parser<T> {
    return new Parser(run, label);
  }

  constructor(public run: ParseFn<T>, public label?: string) {};

  /**
   * Return wrapping `Parser` that maps *fn* over successfully parsed value.
   */
  map<R>(fn: (parsed: T) => R): Parser<R> {
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




// -- PARSER CONVENIENCE FUNCTIONS ---------------------------------------------


/**
 * Test if given argument extends `ParseFailure`.
 */
export const didParseFail = <T>(result: Result<T>): result is ParseFailure => (
  result instanceof ParseFailure
);


/**
 * Test if given argument does not extend `ParseFailure`.
 */
export const didParseSucceed = <T>(result: Result<T>): result is T => (
  !(result instanceof ParseFailure)
)


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
export const parApply = curry((arg: Parser, parser: Parser) => (
  parser.apply(arg)
));


/**
 * Bind of `Parser` monad.
 */
export const parBind = curry((fn: (p: any) => Parser, parser: Parser) => (
  Parser.of((stream) => {
    let parserResult = run(parser, stream);
    if (didParseFail(parserResult))
      return parserResult;
    return run(fn(parserResult), stream);
  })
));


/**
 * Return new `Parser` with given *label*.
 */
export const parLabel = curry((label: string, parser: Parser) => (
  Parser.of((stream) => {
    let result = run(parser, stream);
    if (didParseFail(result))
      result.label = label;
    return result;
  }, label)
));



export const labelledParser = <T>(fn: ParseFn<T>, label: string) => (
  Parser.of((stream) => {
    let result = fn(stream);
    if (didParseFail(result))
      result.label = label;
    return result;
  }, label)
);
