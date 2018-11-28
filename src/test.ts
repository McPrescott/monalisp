// -----------------------------------------------------------------------------
// -- TESTING
//------------------------------------------------------------------------------


import {log} from './util';
import {isLetter} from './read/common/predicates';
import {join} from './read/common/transformers';
import {CharStream} from './read/char-stream';
import {parMap} from './read/parser';
import {parseChar, satisfy} from './read/parsers/string';
import {star, plus} from './read/parsers/combinators';

const parseLetter = satisfy(isLetter, 'letter');
const parseLetters = parMap(join, plus(parseLetter, 'letters'));

const source = 'zbc';
const stream = CharStream.of(source);
const parser = parseLetters;
const result = parser.run(stream);
const remaining = stream.rest;


log('! Result:', result);
log('! Remain:', remaining);
