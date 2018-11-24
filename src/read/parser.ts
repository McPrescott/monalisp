// -----------------------------------------------------------------------------
// -- TYPE CLASSES
//------------------------------------------------------------------------------


// TODO: 
//   + Result -> ParseResult?
//   + ParseFn -> ParseFunction | ParseProcedure | ParseMethod??
//   + parLabel
//   + Write simple ramda functions?


import {is, not} from 'ramda';
import {curry, pipe} from '../~functional';
import {Failure} from '../base';
import {Unary, UnaryPred} from '../util';
import {CharStream} from './char-stream';



/**
 * Parse function signature of `Parser`.
 */
export type ParseFn = (stream: CharStream) => Result;


/**
 * Result of `ParseFn`.
 */
export type Result = any | ParseFailure;



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



// -- PARSER CONVENIENCE FUNCTIONS ---------------------------------------------


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



export const parLabel = curry((label: string, parser: Parser) => {

});
