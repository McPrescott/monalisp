// -----------------------------------------------------------------------------
// -- MONALISP MAIN
//------------------------------------------------------------------------------


import {didParseFail} from './read/parse/parser';
import {read} from './read/reader';
import {didEvalFail} from './eval/eval-failure';
import {evaluate} from './eval/evaluator'
import {global} from './eval/global';


export {read} from './read/reader';
export {evaluate} from './eval/evaluator';


/**
 * Execute given Monalisp *code*.
 */
export const execute = (code: string) => {
  const parsedForms = read(code);
  if (didParseFail(parsedForms))
    throw new SyntaxError(parsedForms.toString());
  let result: EvalResult<EvalForm>;
  for (const form of parsedForms) {
    result = evaluate(global, form);
    if (didEvalFail(result))
      return result;
  }
  return result;
};
