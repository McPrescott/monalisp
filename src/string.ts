// Various String Utility Functions.

import {curry, Pred, invertPredicate, log} from './util';

const NL = '\n';
const TAB = '\t';
const NUL = '\0';
const SPACE = ' ';
const OPEN_PAREN = '(';
const CLOSE_PAREN = ')'
const OPEN_BRACE = '[';
const CLOSE_BRACE = ']';
const OPEN_CURLY = '{';
const CLOSE_CURLY = '}';
const SNG_QUT = "'";
const DBL_QUT = '"';

enum Char {
  NewLine = '\n',
  Space = ' ',
  Tab = '\t',
  Null = '\0',
  OpenParen = '(',
  CloseParen = ')',
  OpenBracket = '[',
  CloseBracket = ']',
  OpenCurly = '{',
  CloseCurly = '}',
  DoubleQuote = '"',
  SingleQuote = "'",
}

export const Rgx = {
  Space: /\s/,
  NonSpace: /\S/,
  Alpha: /[A-Z]/i,
  Lower: /[a-z]/,
  Upper: /[A-Z]/,
  AlphaNum: /\w/,
  Digit: /\d/
};

export class CharStream {
  pos: number;
  line: number;
  linePos: number;

  constructor(public source: string) {
    this.pos = 0;
    this.linePos = 0;
    this.line = 0;
  }

  get length() {
    return this.source.length;
  }

  next() {
    if (this.pos >= this.length)
      return '';
    const char = this.source[this.pos];
    if (char === Char.NewLine) {
      this.line++;
      this.linePos = 0;
    }
    return this.source[this.pos++];
  }

  peek() {
    if (this.pos >= this.length)
      return '';
    return this.source[this.pos];
  }

  skip() {
    if (this.pos >= this.length)
      return;

    const char = this.source[this.pos];
    if (char === Char.NewLine) {
      this.line++;
      this.linePos = 0;
    }
    this.pos++;
  }
}


class ParseError extends Error {
  constructor({line, linePos}: CharStream) {
    const msg = `Parse Error at ${line}:${linePos}`;
    super(msg);
  }
}


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
  return parseWhile(invertPredicate(pred), stream);
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


const source = 'ident123 avfs';
const stream = new CharStream(source);
const parse = parseSeq([
  parseWhile(test(Rgx.Alpha)),
  parseWhile(test(Rgx.Digit))
]);


log(parse(stream));
log(stream.next());
