// -----------------------------------------------------------------------------
// -- MONALISP MAIN
//------------------------------------------------------------------------------


import {didParseFail} from './read/parse/parser';
import {read} from './read/reader';
import {evaluate} from './eval/evaluator';


export {read} from './read/reader';
export {evaluate} from './eval/evaluator';


/**
 * Execute given Monalisp *code*.
 */
export const execute = (code: string) => {
  const parsed = read(code);
  if (didParseFail(parsed))
    throw new SyntaxError(parsed.toString());
  return evaluate(parsed);
};