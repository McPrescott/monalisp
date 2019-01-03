// -----------------------------------------------------------------------------
// -- VARIABLE CLASS
//------------------------------------------------------------------------------


import {formFlagOf} from './form-flag';


export const variable = (
  (expr: FormType, src: CharStream.State, type=formFlagOf(expr))
  : VariableType => ({
    expr,
    src,
    type
  } as VariableType)
);
