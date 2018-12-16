// -----------------------------------------------------------------------------
// -- QUOTE MACRO (')
//------------------------------------------------------------------------------


import {CharStream} from '../parse/char-stream';
import {Parser, run, didParseFail} from '../parse/parser';
import {Tagged, ParseType} from '../tagging';
import {getIdentifier} from '../identifier';
import {sExprParser, SExpression} from '../s-expression';


/**
 * Return `Tagged<Identifier>` with given `CharStream` *info*.
 */
const taggedQuote = (info: CharStream.Info) => {
  const id = getIdentifier('quote')
  return Tagged.fromExpanded(id, ParseType.Identifier, info);
}


/**
 * Monalisp's quote macro (`'`).
 */
export const quoteMacro: Parser<SExpression> = Parser.of((stream) => {
  const expression = run(sExprParser, stream);
  if (didParseFail(expression))
    return expression;
  return [taggedQuote(stream.info), expression];
});
