// -----------------------------------------------------------------------------
// -- BUILTIN MATH PROCEDURES
//------------------------------------------------------------------------------


import {head, tail} from '../../~hyfns/list';
import {SpecialForm} from '../type/special-form';
import {evalArgumentList, didEvalFail, EvalFailure} from '../evaluator';



/**
 * Builtin addition function.
 */
export const add = SpecialForm.of((scope, arglist) => {
  let evaledArglist = evalArgumentList(scope, arglist);
  if (didEvalFail(evaledArglist))
    return evaledArglist;
  let sum = 0;
  for (let n of evaledArglist) {
    if (typeof n !== 'number')
      return EvalFailure.of(`Arguments to '+' must be numbers, got ${n}`);
    sum += n;
  }
  return sum;
});


/**
 * Builtin subtraction function.
 */
export const subtract = SpecialForm.of((scope, arglist) => {
  let evaledArglist = evalArgumentList(scope, arglist);
  if (didEvalFail(evaledArglist))
    return evaledArglist;
  let diff = head(evaledArglist);
  if (typeof diff !== 'number')
      return EvalFailure.of(`Arguments to '-' must be numbers, got ${diff}`);
  for (let n of tail(evaledArglist)) {
    if (typeof n !== 'number')
      return EvalFailure.of(`Arguments to '-' must be numbers, got ${n}`);
    diff -= n;
  }
  return diff;
});


/**
 * Builtin addition function.
 */
export const multiply = SpecialForm.of((scope, arglist) => {
  let evaledArglist = evalArgumentList(scope, arglist);
  if (didEvalFail(evaledArglist))
    return evaledArglist;
  let product = 1;
  for (let n of evaledArglist) {
    if (typeof n !== 'number')
      return EvalFailure.of(`Arguments to '+' must be numbers, got ${n}`);
    product *= n;
  }
  return product;
});


/**
 * Builtin subtraction function.
 */
export const divide = SpecialForm.of((scope, arglist) => {
  let evaledArglist = evalArgumentList(scope, arglist);
  if (didEvalFail(evaledArglist))
    return evaledArglist;
  let diff = head(evaledArglist);
  if (typeof diff !== 'number')
      return EvalFailure.of(`Arguments to '-' must be numbers, got ${diff}`);
  for (let n of tail(evaledArglist)) {
    if (typeof n !== 'number')
      return EvalFailure.of(`Arguments to '-' must be numbers, got ${n}`);
    diff /= n;
  }
  return diff;
});