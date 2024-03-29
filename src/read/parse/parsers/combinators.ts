// -----------------------------------------------------------------------------
// -- PARSER COMBINATORS
//------------------------------------------------------------------------------


import {Parser, labelledParser, didParseFail, didParseSucceed, success, pmap, run, ParseFailure} from '../parser';
import {joinFlat} from '../common/transformers';


/**
 * Return `Parser` that sequentially executes *parsers*, returning a list of the
 * results.
 */
export const seq = (
  <T>(...parsers: ParserType<T>[]): ParserType<T[]> => (
    labelledParser((stream) => {
      const parsed = [];
      let result: ParseResultType;
      for (const parser of parsers) {
        result = parser.run(stream);
        if (didParseFail(result))
          return result;
        parsed.push(result);
      }
      return parsed;
    }, (parsers.map(p => p.label).join(', ')))
  )
);


/**
 * Return `Parser` which, upon success, returns the pair [*first*, *second*] of
 * the results.
 */
export const pair = (
  <A, B>(first: ParserType<A>, second: ParserType<B>): ParserType<[A, B]> => (
    Parser.of((stream) => {
      const firstResult = run(first, stream);
      if (didParseFail(firstResult))
        return firstResult;
      const secondResult = run(second, stream);
      return (didParseFail(secondResult))
        ? secondResult
        : [firstResult, secondResult] as [A, B];
    }, `pair (${first.label}, ${second.label})`)
  )
);


/**
 * Return `Parser` which, upon success, returns the triple [*first*, *second*,
 * *third*] of the results.
 */
export const triple = (
  <A, B, C>(first: ParserType<A>, second: ParserType<B>, third: ParserType<C>):
  ParserType<[A, B, C]> => (
    Parser.of((stream) => {
      const firstResult = run(first, stream);
      if (didParseFail(firstResult))
        return firstResult;
      const secondResult = run(second, stream);
      if (didParseFail(secondResult))
        return secondResult;
      const thirdResult = run(third, stream);
      return (didParseFail(thirdResult))
        ? thirdResult
        : [firstResult, secondResult, thirdResult] as [A, B, C];
    }, `triple (${first.label}, ${second.label}, ${third.label})`)
  )
);


/**
 * Return `Parser` that runs provided *parser*, but returns placeholder
 * `ParseSuccess` upon success.
 */
export const skip = <T>(parser: ParserType<T>, label?: string): ParserType<ParseSuccessType> => (
  labelledParser((stream) => {
    const result = parser.run(stream);
    return (didParseFail(result)) ? result : success;
  }, (label || `Skip ${parser.label}`))
);


/**
 * Returns `Parser` that runs provided *parser* as many times as
 * possible. The returned `Parser` can never fail, if the first parsing attempt
 * fails the empty list is returned.
 */
export const star = <T>(parser: ParserType<T>, label?: string): ParserType<T[]> => (
  labelledParser((stream) => {
    const results = [];
    let currentResult: ParseResultType<T>;
    while (didParseSucceed(currentResult = parser.run(stream))) {
      results.push(currentResult);
    }
    return results;
  }, (label || `Star ${parser.label}`))
);


/**
 * Returns `Parser` that runs given *parser* repeatedly until failure. If
 * parsing fails on the first attempt the `ParseFailure` is returned.
 */
export const plus = <T>(parser: ParserType<T>, label?: string): ParserType<T[]> => (
  labelledParser((stream) => {
    let result = parser.run(stream);
    if (didParseFail(result))
      return result;
    let results = [result];
    while (didParseSucceed(result = parser.run(stream))) {
      results.push(result as T);
    }
    return results;
  }, (label || `Plus ${parser.label}`))
);


/**
 * Returns `Parser` that runs given *parser* once. When parse is successful the
 * result is returned, otherwise `ParseSuccess` is returned.
 */
export const opt = <T>(parser: ParserType<T>, label?: string) => (
  labelledParser((stream) => {
    const result = parser.run(stream);
    return (didParseSucceed(result)) ? result : success;
  }, (label || `Optional ${parser.label}`))
);


/**
 * Return `Parser` that sequentially attempts to given *parsers*, returning the
 * result of the first successful parse, or the result of the last failure.
 */
export const choice = <T>(...parsers: ParserType<T>[]): ParserType<T> => (
  labelledParser((stream) => {
    let current: ParseResultType<T>;
    for (const parser of parsers) {
      current = parser.run(stream);
      if (didParseSucceed(current))
        return current;
    }
    return current;
  }, (`Choice of ${parsers.map(p => p.label).join(', ')}`))
);


/**
 * Return `Parser` that runs both *before* and *after* respectively, returning
 * only the result of *after* upon success.
 */
export const after = <T>(before: ParserType, after: ParserType<T>) => (
  Parser.of((stream) => {
    const beforeResult = run(before, stream);
    if (didParseFail(beforeResult))
      return beforeResult;
    return run(after, stream);
  })
);


/**
 * Return `Parser` that runs both *before* and *after* respectively, returning
 * only the result of *before* upon success.
 */
export const before = <T>(before: ParserType<T>, after: ParserType): ParserType<T> => (
  Parser.of((stream) => {
    const result = run(before, stream);
    if (didParseFail(result))
      return result;
    const afterResult = run(after, stream);
    if (didParseFail(afterResult))
      return afterResult;
    return result;
  })
);


/**
 * Return `Parser` that runs each of the *pre*, *mid*, *post* `Parser`s
 * provided, returning only the result of *mid* on success.
 */
export const between = (
  <T>(pre: ParserType, mid: ParserType<T>, post: ParserType): ParserType<T> => (
    Parser.of((stream) => {
      const preResult = run(pre, stream);
      if (didParseFail(preResult))
        return preResult;
      const result = run(mid, stream);
      if (didParseFail(result))
        return result;
      const postResult = run(post, stream);
      if (didParseFail(postResult))
        return postResult;
      return result;
    })
  )
);


/**
 * Return `Parser` that runs *surround* before and after given *parser*,
 * returning only the result of *parser* upon successful completion.
 */
export const surround = <T>(parser: ParserType<T>, surround: ParserType): ParserType<T> => (
  between(surround, parser, surround)
);


/**
 * Return `Parser` that parses a series elements resulting from given *element*
 * `Parser`, separated by *separator*. This parser never fails; if
 * failure occurs on the first parsing attempt, the empty list is returned.
 */
export const series = (
  <T>(element: ParserType<T>, separator: ParserType): ParserType<T[]> => (
    Parser.of((stream) => {
      const elements = [];
      const sepElement = after(separator, element);
      let result: ParseResultType<T> = run(element, stream);
      while (didParseSucceed(result)) {
        elements.push(result);
        result = run(sepElement, stream);
      }
      return elements;
    })
  )
);


/**
 * Return `Parser` that parses a series of *element*s separated by *separator*.
 * If the amount of elements parsed is less than *min* (defaults to 1), the
 * parse fails.
 */
export const minSeries = (
  <T>(element: ParserType<T>, separator: ParserType, min=1): ParserType<T[]> => (
    Parser.of((stream) => {
      const elements = [];
      const sepElement = after(separator, element);
      let result: ParseResultType<T> = run(element, stream);
      while (didParseSucceed(result)) {
        elements.push(result);
        result = run(sepElement, stream);
      }
      if (elements.length < min)
        return result;
      return elements;
    })
  )
);


/**
 * Return `Parser` that parses a series of *element*s separated by *separator*.
 * If the amount of elements parsed is more than *max* (defaults to Infinity),
 * the parse fails.
 */
export const maxSeries = (
  <T>(element: ParserType<T>, separator: ParserType, max=Infinity): ParserType<T[]> => (
    Parser.of((stream) => {
      const elements = [];
      const sepElement = after(separator, element);
      let result: ParseResultType<T> = run(element, stream);
      while (didParseSucceed(result)) {
        if (elements.push(result) > max)
          break;
        result = run(sepElement, stream);
      }
      if (elements.length > max) {
        return ParseFailure.of(
          `Expected less than ${max} elements.`,
          `series of ${max} ${element.label}`,
          stream.info
        );
      }
      return elements;
    })
  )
);


/**
 * Return `Parser` that run given *parser* normally, except that upon failure
 * the position of the `CharStream` is reset.
 */
export const attempt = <T>(parser: ParserType<T>, label?: string): ParserType<T> => (
  labelledParser((stream) => {
    stream.save();
    const result = parser.run(stream);
    (didParseFail(result)) ? stream.restore() : stream.unsave();
    return result;
  }, (label || `Attempt ${parser.label}`))
);


/**
 * Return `Parser` that runs given *parser* until encountering the end of
 * `CharStream`, or until `ParseFailure`. Upon success a list of each parsed
 * value is returned; upon failure, the `ParseFailure` is returned immediately.
 */
export const completion = <T>(parser: ParserType<T>): ParserType<T[]> => (
  Parser.of((stream) => {
    const results: T[] = [];
    let result: ParseResultType<T>;
    while (!stream.isDone) {
      result = run(parser, stream);
      if (didParseFail(result))
        return result;
      results.push(result);
    }
    return results;
  })
);


/**
 * Join list contained in *parser* into a string.
 */
export const pjoin = <T>(parser: ParserType<T[]>, sep=""): ParserType<string> => (
  parser.map((parsed) => parsed.join(sep))
);


/**
 * Flatten and join nested lists contained in *parser* into a string.
 */
export const pjoinFlat = <T>(parser: ParserType<T[]>, sep=""): ParserType<string> => (
  parser.map((parsed) => joinFlat(parsed, sep))
);


/**
 * Replaces the successfully parsed value of *parser* with *value*.
 */
export const setParsed = <A, B>(parser: ParserType<A>, value: B): ParserType<B> => (
  pmap((_) => value, parser)
);


/**
 * Create forward referencable `Parser`. Before using the wrapper, the property
 * `parser` of the returned `ParserReference` should be replaced with the actual
 * `Parser`.
 */
export const fref = <T=any>(): ParserReferencePair<T> => {
  const ref: ParserReference<T> = {
    //@ts-ignore
    parser: <ParserType<T>> Parser.of((stream) => (
      ParseFailure.of(
        `Forward reference has not been replaced.`,
        'unknown',
        stream.info
      )
    ))
  };

  const wrapper = Parser.of((stream) => ref.parser.run(stream));
  return [ref, wrapper];
}

export type ParserReferencePair<T=any> = [ParserReference<T>, ParserType<T>];

export interface ParserReference<T=any> {
  parser: ParserType<T>;
};