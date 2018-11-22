import {curry, invertPred, Pred} from '../util';
import {CharStream} from './char-stream';

type StringTest = RegExp | string;
type Parser = (stream: CharStream) => string;


export const empty = "";


export const is = curry((test: string, str: string) => (
  test === str
));


export const isNot = curry((test: string, str: string) => (
  test !== str
));


export const test = curry((test: StringTest, str: string) => (
  str.search(test) !== -1
));


export const testNot = curry((test: StringTest, str: string) => (
  str.search(test) === -1
));


export const parseChar = curry((char: string, stream: CharStream) => {
  let next = stream.next();
  if (is(char, next))
    return char;
  return '';
});


export const parseWhile = curry((pred: Pred<string>, stream: CharStream) => {
  let parsed = empty;
  while (pred(stream.peek())) {
    parsed += stream.next();
  }
  return parsed;
});


export const parseWhileMatch = curry((regexp: RegExp, stream: CharStream) => {
  return parseWhile(test(regexp));
});


export const parseUntil = curry((pred: Pred<string>, stream: CharStream) => {
  return parseWhile(invertPred(pred), stream);
});


export const parseBetween = curry((start: string, end: string, stream: CharStream) => {
  let parsed = empty;
  if (isNot(start, stream.peek()))
    return parsed;
  const isNotEnd = isNot(end);
  stream.skip();
  let next;
  while ((next = stream.peek()) && isNotEnd(next)) {
    parsed += stream.next();
  }
  stream.skip();
  return parsed;
});


export const parseSeq = curry((parsers: Parser[], stream: CharStream) => (
  parsers.reduce((parsed, parse) => (
    parsed.concat(parse(stream))
  ), empty)
));
