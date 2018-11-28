// -----------------------------------------------------------------------------
// -- STRING PARSERS
//------------------------------------------------------------------------------


import {map} from 'ramda';
import {UnaryPred} from "../../util";
import {ParseFailure, Parser, Result} from "../parser";
import {isChar} from "../common/predicates";
import { sequence } from './combinators';


/**
 * Return character `Parser`, that succeeds according to *predicate*.
 */
export const satisfy = (predicate: UnaryPred<string>, label='satisfy') => (
  Parser.of((stream): Result<string> => {
    if (predicate(stream.peek()))
      return stream.next();
    let message = `"${stream.peek()}" does not satisfy given predicate.`;
    return ParseFailure.of(message, label, stream.info);
  }, label)
);


/**
 * Return character `Parser` that parses given *char*.
 */
export const parseChar = (char: string, label=char) => (
  satisfy(isChar(char), label)
);


/**
 * Return `Parser` that parses given *searchString*.
 */
export const parseString = (searchString: string, label=searchString) => (
  sequence(
    //@ts-ignore
    map(parseChar, searchString)
  , label)
);
