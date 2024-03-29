// -----------------------------------------------------------------------------
// -- TYPE CLASSES
//------------------------------------------------------------------------------


import {curry} from '../../~hyfns/index';
import {SPACE} from './common/chars';


/**
 * Parse success, typically used as a placeholder for parsers that throw away
 * values.
 */
export class ParseSuccess implements ParseSuccessType {
  toString() {
    return '';
  }
}

export const success = new ParseSuccess();


/**
 * Parsing failure type.
 */
export class ParseFailure implements ParseFailureType {

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
export class Parser<T=any> implements ParserType<T> {

  /**
   * Return `Parser` that ignores given *stream* and returns given *value*.
   */
  static return<T>(value: T): ParserType<T> {
    return Parser.of((stream) => value);
  }

  /**
   * Static constructor function.
   */
  static of<T>(run: ParseFunctionType<T>, label?: string): ParserType<T> {
    return new Parser(run, label);
  }

  constructor(public run: ParseFunctionType<T>, public label?: string) {};

  /**
   * Return wrapping `Parser` that maps *fn* over successfully parsed value.
   */
  map<U>(fn: (parsed: T) => U): ParserType<U> {
    return Parser.of((stream) => {
      const result = run(this, stream);
      return (didParseFail(result)) ? result : fn(result);
    }, this.label);
  }

  /**
   * Return `Parser` that applies the successful result of *parser* to the
   * successful result of *this*.
   */
  // apply<A>(parser: IParser<A>): IParser<T extends (a: A) => infer B ? B : null> {
  //   return Parser.of((stream) => {
  //     const thisResult = run(this, stream);
  //     if (didParseFail(thisResult))
  //       return thisResult;
  //     const parserResult = run(parser, stream);
  //     return (didParseFail(parserResult)
  //       ? parserResult
  //       // @ts-ignore
  //       : thisResult(parserResult));
  //   });
  // }
}




// -- PARSER CONVENIENCE FUNCTIONS ---------------------------------------------


/**
 * Test if given argument extends `ParseFailure`.
 */
export const didParseFail = <T>(result: ParseResultType<T>): result is ParseFailureType => (
  result instanceof ParseFailure
);


/**
 * Test if given argument does not extend `ParseFailure`.
 */
export const didParseSucceed = <T>(result: ParseResultType<T>): result is T => (
  !(result instanceof ParseFailure)
);


/**
 * Run *parser* with given *stream*.
 */
export const run: Run = curry((parser: ParserType, stream: CharStreamType) => (
  parser.run(stream)
));

interface Run {
  <T>(parser: ParserType<T>): (stream: CharStreamType) => ParseResultType<T>;
  <T>(parser: ParserType<T>, stream: CharStreamType): ParseResultType<T>;
}


/**
 * Return `Parser` that always returns *returnValue*.
 */
export const preturn = <T>(returnValue: T): ParserType<T> => (
  Parser.return(returnValue)
);


/**
 * Map *fn* over given *parser*.
 *
 * `pmap :: (A -> B) -> Parser<A> -> Parser<B>`
 */
export const pmap: PMap = curry((fn: Unary, parser: ParserType) => (
  parser.map(fn)
));

interface PMap {
  <A, B>(fn: (parsed: A) => B, parser: ParserType<A>): ParserType<B>;
  <A, B>(fn: (parsed: A) => B): (parser: ParserType<A>) => ParserType<B>;
}


/**
 * Apply *parsed* to the resulting function of *parser*.
 *
 * `papply :: Parser<a -> b> -> Parser<a> -> Parser<b>`
 */
export const papply: PApply = curry(
  <A, B>(parser: ParserType<(parsed: A) => B>, parsed: ParserType<A>) => (
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
  <A, B>(parser: ParserType<(parsed: A) => B>, parsed: ParserType<A>): ParserType<B>;
  <A, B>(parser: ParserType<(parsed: A) => B>): (parsed: ParserType<A>) => ParserType<B>;
}


/**
 * Apply the result of *parser* to *producer*, returning a new `Parser`.
 *
 * `pbind :: (A -> Parser<B>) -> Parser<A> -> Parser<B>`
 */
export const pbind: PBind = (
  curry((fn: (p: any) => ParserType, parser: ParserType) => (
    Parser.of((stream) => {
      let parserResult = run(parser, stream);
      if (didParseFail(parserResult))
        return parserResult;
      return run(fn(parserResult), stream);
    })
  ))
);

interface PBind {
  <A, B>(producer: (parsed: A) => ParserType<B>, parser: ParserType<A>): ParserType<B>;
  <A, B>(producer: (parsed: A) => ParserType<B>): (parser: ParserType<A>) => ParserType<B>;
}


/**
 * Return new `Parser` with given *label*.
 */
export const plabel: PLabel = curry((label: string, parser: ParserType) => (
  Parser.of((stream) => {
    let result = run(parser, stream);
    if (didParseFail(result))
      result.label = label;
    return result;
  }, label)
));

interface PLabel {
  <T>(label: string, parser: ParserType<T>): ParserType<T>;
  (label: string): <T>(parser: ParserType<T>) => ParserType<T>;
}


/**
 * Create `Parser` with given *parseFn* and *label*.
 */
export const labelledParser = <T>(parseFn: ParseFunctionType<T>, label: string) => (
  Parser.of((stream) => {
    let result = parseFn(stream);
    if (didParseFail(result))
      result.label = label;
    return result;
  }, label)
);


/**
 * Map given *fn* over `ParseFailure` of given *parser* on error, successfully
 * parsed values are passed through unmodified.
 */
export const perror: PError = curry(
  <T>(fn: (failure: ParseFailureType) => ParseFailureType, parser: ParserType<T>) => (
    Parser.of((stream) => {
      const result = run(parser, stream);
      if (didParseFail(result))
        return fn(result);
      return result;
    })
  )
);

interface PError {
  <T>(fn: (failure: ParseFailureType) => ParseFailureType, parser: ParserType<T>):
    ParserType<T>;
  (fn: (failure: ParseFailureType) => ParseFailureType):
    <T>(parser: ParserType<T>) => ParserType<T>;
}
