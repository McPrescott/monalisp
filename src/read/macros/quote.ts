// -----------------------------------------------------------------------------
// -- QUOTE MACRO (')
//------------------------------------------------------------------------------


import {Parser, run, didParseFail} from '../parse/parser';
import {getIdentifier} from '../../common/identifier';
import {ReaderTag, ReaderFormFlag} from '../tagging';
import {readerFormParser} from '../s-expression';


/**
 * Return `Tagged<Identifier>` with given `CharStream` *info*.
 */
const taggedQuote = (info: CharStream.Info) => {
  const id = getIdentifier('quote')
  return ReaderTag.fromExpanded(id, ReaderFormFlag.Identifier, info);
}


/**
 * Monalisp's quote macro (`'`).
 */
export const quoteMacro: ParserType<ReaderForm> = Parser.of((stream) => {
  const expression = run(readerFormParser, stream);
  if (didParseFail(expression))
    return expression;
  return [taggedQuote(stream.info), expression];
});
