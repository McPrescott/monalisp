// -----------------------------------------------------------------------------
// -- TAGGING
//------------------------------------------------------------------------------


import {Identifier} from '../common/identifier';
import {Keyword} from '../common/keyword';
import {Parser, run, didParseFail} from './parse/parser';


/**
 * Enumeration of possible `SExpression` types.
 */
export enum ReaderFormFlag {
  Nil         = 0o1,
  Boolean     = 0o2,
  Number      = 0o4,
  String      = 0o10,
  Identifier  = 0o20,
  Keyword     = 0o40,
  List        = 0o100,
  Dictionary  = 0o200
}


/**
 * Wrapper around parsed `SExpression` with addition of type information as well
 * as information about its position in source.
 */
export class ReaderTag<T> implements ReaderTagType<T> {

  /**
   * Static factory function of `ReaderTag`.
   */
  static of<T>(expression: T, type: ReaderFormFlag, info: CharStream.Info): ReaderTag<T> {
    return new ReaderTag(expression, type, info);
  };
  
  /**
   * Static factory function of `ReaderTag` for forms expanded from a reader
   * macro.
   */
  static fromExpanded<T>(expression: T, type: ReaderFormFlag, info: CharStream.Info) {
    return new ReaderTag(expression, type, info, true);
  }

  constructor(
    public readonly expression: T, 
    public readonly type: ReaderFormFlag, 
    public readonly info: CharStream.Info,
    public readonly isExpanded: boolean = false
  ) {};
}


/**
 * Get `ParseType` of parsed `SExpr`.
 */
const getTypeOf = <T>(expression: T): ReaderFormFlag => {
  return (
    (expression === null) ? ReaderFormFlag.Nil
  : (typeof expression === 'boolean') ? ReaderFormFlag.Boolean
  : (typeof expression === 'number') ? ReaderFormFlag.Number
  : (typeof expression === 'string') ? ReaderFormFlag.String
  : (expression instanceof Identifier) ? ReaderFormFlag.Identifier
  : (expression instanceof Keyword) ? ReaderFormFlag.Keyword
  : (Array.isArray(expression)) ? ReaderFormFlag.List
  : ReaderFormFlag.Dictionary
  );
}


/**
 * Tag parsed `SExpr`s with origin and type information.
 */
export const ptag = <T>(parser: ParserType<T>): ParserType<ReaderTag<T>> => (
  Parser.of((stream) => {
    const info = stream.info;
    const expression = run(parser, stream);
    if (didParseFail(expression))
      return expression;
    return ReaderTag.of(expression, getTypeOf(expression), info);
  }, parser.label)
);
