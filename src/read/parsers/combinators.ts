// -----------------------------------------------------------------------------
// -- PARSER COMBINATORS
//------------------------------------------------------------------------------


import {Parser, Result, labelledParser, didParseFail, didParseSucceed, success} from "../parser";


/**
 * Return `Parser` that sequentially executes *parsers*, returning a list of the
 * results.
 */
export const seq = (
  <T>(parsers: Parser<T>[], label?: string): Parser<T[]> => (
    labelledParser((stream) => {
      const parsed = [];
      let result: Result;
      for (const parser of parsers) {
        result = parser.run(stream);
        if (didParseFail(result))
          return result;
        parsed.push(result);
      }
      return parsed;
    }, (label || parsers.map(p => p.label).join(', ')))
  )
);


/**
 * Return `Parser` that runs provided *parser*, but returns placeholder
 * `ParseSuccess` upon success.
 */
export const skip = <T>(parser: Parser<T>, label?: string) => (
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
export const star = <T>(parser: Parser<T>, label?: string): Parser<T[]> => (
  labelledParser((stream) => {
    const results = [];
    let currentResult: Result<T>;
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
export const plus = <T>(parser: Parser<T>, label?: string) => (
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
 * result is returned, otherwise `null` is returned.
 */
export const opt = <T>(parser: Parser<T>, label?: string) => (
  labelledParser((stream) => {
    const result = parser.run(stream);
    return (didParseSucceed(result)) ? result : null;
  }, (label || `Optional ${parser.label}`))
);


/**
 * Return `Parser` that sequentially attempts to given *parsers*, returning the
 * result of the first successful parse, or the result of the last failure.
 */
export const choice = <T>(parsers: Parser<T>[], label?: string) => (
  labelledParser((stream) => {
    let current: Result<T>;
    for (const parser of parsers) {
      current = parser.run(stream);
      if (didParseSucceed(current))
        return current;
    }
    return current
  }, (label || `Choice of ${parsers.map(p => p.label).join(', ')}`))
);


/**
 * Return `Parser` that run given *parser* normally, except that upon failure
 * the position of the `CharStream` is reset.
 */
export const attempt = <T>(parser: Parser<T>, label?: string) => (
  labelledParser((stream) => {
    stream.save();
    const result = parser.run(stream);
    (didParseFail(result)) ? stream.restore() : stream.unsave();
    return result;
  }, (label || `Attempt ${parser.label}`))
);
