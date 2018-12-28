// -----------------------------------------------------------------------------
// -- MONALISP MAIN
//------------------------------------------------------------------------------


import {didParseFail} from './read/parse/parser';
import {read} from './read/reader';
import {didEvalFail} from './eval/eval-failure';
import {globalScope} from './eval/global';


export {read} from './read/reader';
export {evalForm as evaluate} from './eval/eval-failure';


/**
 * Execute given Monalisp *code*.
 */
export const execute = (code: string) => {
  const parsed = read(code);
  if (didParseFail(parsed))
    throw new SyntaxError(parsed.toString());
  let result: EvalResult<EvalForm>;
  for (const form of parsed) {
    result = evalForm.run(globalScope, form);
    if (didEvalFail(result))
      return result;
  }
  return result;
};
