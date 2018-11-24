// -----------------------------------------------------------------------------
// -- TESTING
//------------------------------------------------------------------------------


import {curry} from './~functional';
import {Binary, log} from './util';
import {OPEN_PAREN, CLOSE_PAREN} from './read/common/chars';
import {charRange, toInt} from './read/string-util';
import {CharStream} from './read/char-stream';
import {Parser, parMap, run} from './read/parser';
import {andThen, anyOf, opt, oneOrMore, pchar, pBetween} from './read/combinators';


const liftTwo = curry((fn: Binary, x: Parser, y: Parser) => (
  Parser.return(fn).apply(x).apply(y)
));


// Parser int string to number value
const pDigit = anyOf(charRange('0', '9'));
const optIntSign = opt(pchar('-'));
const anyInt = andThen([optIntSign, oneOrMore(pDigit)]);
const pInt = parMap(toInt, anyInt);

// Parser addition
const add = curry((x: number, y: number) => x + y);
const addP = liftTwo(add)

// Parser between parenthesis
const pOpenParen = pchar(OPEN_PAREN);
const pCloseParen = pchar(CLOSE_PAREN);
const pLowerWord = oneOrMore(anyOf(charRange('a', 'z')));

const source = '(hello)';
const stream = new CharStream(source);
const parser = pBetween(pOpenParen, pLowerWord, pCloseParen);
const result = run(parser, stream);

log('! Parsed:', result);
log('! Remain:', stream.rest);

interface StringConstructor {
  isNullOrEmpty(str: string): boolean;
}
