// -----------------------------------------------------------------------------
// -- TYPE CLASSES
//------------------------------------------------------------------------------


import {curry} from '../../~hyfns/index';
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
 * Parse success, typically used as a placeholder for parsers that throw away
 * values.
 */
export class ParseSuccess {
  toString() {
    return '';
  }
}

export const success = new ParseSuccess();


/**
 * Parsing failure type.
 */
export class ParseFailure {

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
  ) {};

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
      return (didParseFail(result)) ? result : fn(result);
    }, this.label);
  }

  /**
   * Return `Parser` that applies the successful result of *parser* to the
   * successful result of *this*.
   */
  apply<A>(parser: Parser<A>): Parser<T extends (a: A) => infer B ? B : null> {
    return Parser.of((stream) => {
      const thisResult = run(this, stream);
      if (didParseFail(thisResult))
        return thisResult;
      const parserResult = run(parser, stream);
      return (didParseFail(parserResult)
        ? parserResult
        // @ts-ignore
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
);


/**
 * Run *parser* with given *stream*.
 */
export const run: Run = (
  curry((parser: Parser, stream: CharStream) => 
    parser.run(stream)
  )
);

interface Run {
  <T>(parser: Parser<T>): (stream: CharStream) => Result<T>;
  <T>(parser: Parser<T>, stream: CharStream): Result<T>;
}


/**
 * Return `Parser` that always returns *returnValue*.
 */
export const preturn = <T>(returnValue: T): Parser<T> => (
  Parser.return(returnValue)
);


/**
 * Map *fn* over given *parser*.
 * 
 * `pmap :: (A -> B) -> Parser<A> -> Parser<B>`
 */
export const pmap: PMap = curry((fn: Unary, parser: Parser) => (
  parser.map(fn)
));

interface PMap {
  <A, B>(fn: (x: A) => B, parser: Parser<A>): Parser<B>;
  <A, B>(fn: (x: A) => B): (parser: Parser<A>) => Parser<B>;
}



/**
 * Apply *parsed* to the resulting function of *parser*.
 * 
 * `papply :: Parser<a -> b> -> Parser<a> -> Parser<b>`
 */
export const papply: PApply = curry(
  <A, B>(parser: Parser<(parsed: A) => B>, parsed: Parser<A>) => (
    Parser.of((stream) => {
      const parserResult = run(parser, stream);
      if (didParseFail(parserResult))
        return parserResult;
      const parsedResult = run(parsed, stream);
      return (didParseFail(parsedResult))
        ? parsedResult
        : parserResult(parsedResult);
    })
  )
);

interface PApply {
  <A, B>(parser: Parser<(parsed: A) => B>, parsed: Parser<A>): Parser<B>;
  <A, B>(parser: Parser<(parsed: A) => B>): (parsed: Parser<A>) => Parser<B>;
}



/**
 * Apply the result of *parser* to *producer*, returning a new `Parser`.
 * 
 * `pbind :: (A -> Parser<B>) -> Parser<A> -> Parser<B>`
 */
export const pbind: PBind = (
  curry((fn: (p: any) => Parser, parser: Parser) => (
    Parser.of((stream) => {
      let parserResult = run(parser, stream);
      if (didParseFail(parserResult))
        return parserResult;
      return run(fn(parserResult), stream);
    })
  ))
);

interface PBind {
  <A, B>(producer: (parsed: A) => Parser<B>, parser: Parser<A>): Parser<B>;
  <A, B>(producer: (parsed: A) => Parser<B>): (parser: Parser<A>) => Parser<B>;
}


/**
 * Return new `Parser` with given *label*.
 */
export const plabel: PLabel = curry((label: string, parser: Parser) => (
  Parser.of((stream) => {
    let result = run(parser, stream);
    if (didParseFail(result))
      result.label = label;
    return result;
  }, label)
));

interface PLabel {
  <T>(label: string, parser: Parser<T>): Parser<T>;
  <T>(label: string): (parser: Parser<T>) => Parser<T>;
}


export const labelledParser = <T>(fn: ParseFn<T>, label: string) => (
  Parser.of((stream) => {
    let result = fn(stream);
    if (didParseFail(result))
      result.label = label;
    return result;
  }, label)
);
