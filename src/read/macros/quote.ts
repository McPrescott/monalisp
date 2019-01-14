// -----------------------------------------------------------------------------
// -- QUOTE MACRO (')
//------------------------------------------------------------------------------


import {Parser, run, didParseFail} from '../parse/parser';
import {FormFlag as Type} from '../../common/form-flag';
import {variable} from '../../common/variable';
import {getIdentifier} from '../../common/identifier';
import {readerFormParser} from '../s-expression';


/**
 * Return `Tagged<Identifier>` with given `CharStream` *info*.
 */
const quoteVar = (state: CharStream.State) => (
  variable(getIdentifier('quote'), state)
);


/**
 * Monalisp's quote macro (`'`).
 */
export const quoteMacro: ParserType<FormType> = Parser.of((stream) => {
  const expression = run(readerFormParser, stream);
  if (didParseFail(expression))
    return expression;
  return [quoteVar(stream.state), expression];
});
