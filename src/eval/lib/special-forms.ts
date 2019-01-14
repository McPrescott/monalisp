// -----------------------------------------------------------------------------
// -- MONALISP SPECIAL-FORMS
//------------------------------------------------------------------------------


import {isDefined, not} from '../../~hyfns/logic';
import {vlift} from '../../common/variable';
import {isNotIdentifier} from '../../common/variable-type-guards';
import {FormFlag as Flag} from '../../common/form-flag';
import {EvalFailure, didEvalFail} from '../eval-failure';
import {evaluate} from '../evaluator';
import {Signature} from '../type/functions/signature';
import {Procedure} from '../type/functions/procedure';
import {SpecialForm, ParameterKind} from '../type/functions/special-form';


const {Optional, Rest} = ParameterKind;


/**
 * Monalisp `SpecialForm` for binding an `EvalForm` to an `Identifier`.
 */
export const def = SpecialForm.of(
  Signature.of(['id', Flag.Identifier], ['form', Flag.Any]),
  (env, id: IdentifierVar, vForm: VarType) => {
    const form = evaluate(env, vForm);
    if (didEvalFail(form))
      return form;
    return env.define(id.expr, form);
  }
);


/**
 * Monalisp `SpecialForm` for creating a `Procedure`.
 */
export const fn = SpecialForm.of(
  Signature.of(['args', Flag.List], ['exprs', Flag.Any, Rest]),
  (env, args: ListVar, ...exprs: ListVar[]) => {
    const arglist: IdentifierType[] = []
    for (const id of args.expr) {
      if (isNotIdentifier(id)) {
        const message = `Function argument lists must be an Identifier.`;
        return EvalFailure.of(message, id.src);
      }
      arglist.push(id.expr);
    }
    return vlift(Procedure.of(env, arglist, exprs));
  }
);


/**
 * Monalisp `SpecialForm` for returning given form unevaluated.
 */
export const quote = SpecialForm.of(
  Signature.of(['form', Flag.Any]),
  (_, form: VarType) => form
);


/**
 * Monalisp conditional `SpecialForm`.
 */
export const if_ = SpecialForm.of(
  Signature.of(
    ['cond', Flag.Any],
    ['true-branch', Flag.Any],
    ['false-branch', Flag.Any, Optional]
  ),
  (env, cond: VarType, trueBranch: VarType, falseBranch: VarType) => {
    const condResult = evaluate(env, cond);
    if (didEvalFail(condResult)) {
      return condResult
    }
    else if (condResult.expr) {
      return evaluate(env, trueBranch);
    }
    else {
      return (isDefined(falseBranch))
        ? evaluate(env, falseBranch)
        : vlift(null);
    }
  }
);


/**
 * Monalisp `SpecialForm` that returns first falsy-value, or last truthy-value.
 */
export const and = SpecialForm.of(
  Signature.of(['forms', Flag.Any, Rest]),
  (scope, ...forms) => {
    let result: EvalResult = vlift(null);
    for (const form of forms) {
      result = evaluate(scope, form);
      if (didEvalFail(result) || not(result.expr)) {
        return result;
      }
    }
    return result;
  }
);


/**
 * Monalisp `SpecialForm` that returns first truthy-value, or last falsy-value.
 */
export const or = SpecialForm.of(
  Signature.of(['forms', Flag.Any, Rest]),
  (scope, ...forms) => {
    let result: EvalResult = vlift(null);
    for (const form of forms) {
      result = evaluate(scope, form);
      if (didEvalFail(result) || Boolean(result.expr)) {
        return result;
      }
    }
    return result;
  }
);
