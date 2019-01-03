// -----------------------------------------------------------------------------
// -- TAGGING
//------------------------------------------------------------------------------


import {variable} from '../common/variable';
import {Parser, run, didParseFail} from './parse/parser';


/**
 * Tag parsed `SExpr`s with origin and type information.
 */
export const ptag = (
  <T extends FormType>(parser: ParserType<T>): ParserType<VariableType> => (
    Parser.of((stream) => {
      const {state} = stream;
      const expression = run(parser, stream);
      if (didParseFail(expression))
        return expression;
      return variable(expression, state);
    }, parser.label)
  )
);
