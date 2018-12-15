// -----------------------------------------------------------------------------
// -- TAGGING
//------------------------------------------------------------------------------


import {Identifier} from '../builtin/identifier';
import {Keyword} from '../builtin/keyword';
import {CharStream} from './parse/char-stream';
import {Parser, run, didParseFail} from './parse/parser';


/**
 * Enumeration of possible `SExpr` types.
 */
export enum ParseType {
  Nil,
  Boolean,
  String,
  Number,
  Identifier,
  Keyword,
  List,
  Dictionary
}


/**
 * Short-hand type alias for `Parser<Tagged<T>>`
 */
export type TaggedParser<T> = Parser<Tagged<T>>;



/**
 * Wrapper around parsed `SExpr` with addition of type information as well as
 * information about its position in source.
 */
export class Tagged<T> {

  static of<T>
  (expression: T, type: ParseType, info: CharStream.Info): Tagged<T> {
    return new Tagged(expression, type, info);
  };
  
  static fromExpanded<T>
  (expression: T, type: ParseType, info: CharStream.Info) {
    return new Tagged(expression, type, info, true);
  }

  constructor(
    public readonly expression: T, 
    public readonly type: ParseType, 
    public readonly info: CharStream.Info,
    public readonly isExpanded: boolean = false
  ) {};
}


/**
 * Get `ParseType` of parsed `SExpr`.
 */
const getTypeOf = <T>(expression: T): ParseType => {
  return (
    (expression === null) ? ParseType.Nil
  : (typeof expression === 'boolean') ? ParseType.Boolean
  : (typeof expression === 'number') ? ParseType.Number
  : (typeof expression === 'string') ? ParseType.String
  : (expression instanceof Identifier) ? ParseType.Identifier
  : (expression instanceof Keyword) ? ParseType.Keyword
  : (Array.isArray(expression)) ? ParseType.List
  : ParseType.Dictionary
  );
}


/**
 * Tag parsed `SExpr`s with origin and type information.
 */
export const ptag = <T>(parser: Parser<T>): TaggedParser<T> => (
  Parser.of((stream) => {
    const info = stream.info;
    const expression = run(parser, stream);
    if (didParseFail(expression))
      return expression;
    return Tagged.of(expression, getTypeOf(expression), info);
  }, parser.label)
);
