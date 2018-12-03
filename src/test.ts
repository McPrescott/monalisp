// -----------------------------------------------------------------------------
// -- TESTING
//------------------------------------------------------------------------------


import {log} from './util';
import {isLetter} from './read/common/predicates';
import {join} from './read/common/transformers';
import {CharStream} from './read/char-stream';
import {pmap} from './read/parser';
import {pchar, satisfy} from './read/parsers/string';
import {star, plus} from './read/parsers/combinators';
import {parseInt, parseHex, parseBinary} from './read/parsers/numeric';

const parseLetter = satisfy(isLetter, 'letter');
const parseLetters = pmap(join, plus(parseLetter, 'letters'));

const source = '100100111011 followed by some more text.';
const stream = CharStream.of(source);
const parser = parseBinary;
const result = parser.run(stream);
const remaining = stream.rest;


log('! Result:', result);
log('! Remain:', remaining);
