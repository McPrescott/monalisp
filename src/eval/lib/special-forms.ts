// -----------------------------------------------------------------------------
// -- MONALISP SPECIAL-FORMS
//------------------------------------------------------------------------------


import {isDefined, not} from '../../~hyfns/logic';
import {Identifier} from '../../common/identifier';
import {FormFlag as Flag} from '../../common/form-flag';
import {EvalFailure, didEvalFail} from '../eval-failure';
import {evaluate} from '../evaluator';
import {Signature} from '../type/signature';
import {Procedure} from '../type/procedure';
import {SpecialForm, ParameterKind} from '../type/special-form';


const {Optional, Rest} = ParameterKind;


/**
 * Monalisp `SpecialForm` for binding an `EvalForm` to an `Identifier`.
 */
export const def = SpecialForm.of(
  Signature.of(['id', Flag.Identifier], ['form', Flag.Any]),
  (scope, [taggedId, taggedForm]: [TaggedIdentifierType, TaggedReaderForm]) => {
    const form = evaluate(scope, taggedForm);
    if (didEvalFail(form))
      return form;
    const id = taggedId.expression;
    return scope.define(id, form);
  }
);


/**
 * Monalisp `SpecialForm` for creating a `Procedure`.
 */
export const fn = SpecialForm.of(
  Signature.of(['args', Flag.List], ['exprs', Flag.Any, Rest]),
  (scope, [args, exprs]: [TaggedReaderListType, TaggedReaderListType[]]) => {
    const arglist: IdentifierType[] = []
    for (const taggedId of args.expression) {
      const id = taggedId.expression;
      if (!(id instanceof Identifier)) {
        const {info} = taggedId;
        const message = `Function argument lists must be an Identifier.`;
        return EvalFailure.of(message, info);
      }
      arglist.push(id);
    }
    return Procedure.of(scope, arglist, exprs);
  }
);


/**
 * Strip expression from given *form* and from any nested `TaggedReaderForm`. 
 */
const stripExpression = (form: TaggedReaderForm): EvalForm => {
  const {expression} = form;
  if (Array.isArray(expression)) {
    return expression.map(stripExpression);
  }
  if (expression instanceof Map) {
    const dictionary = new Map()
    for (const [key, value] of expression) {
      dictionary.set(stripExpression(key), stripExpression(value));
    }
    return dictionary;
  }
  return expression;
}


/**
 * Monalisp `SpecialForm` for returning given form unevaluated.
 */
export const quote = SpecialForm.of(
  Signature.of(['form', Flag.Any]),
  (scope, [form]: [TaggedReaderForm]) => (
    stripExpression(form)
  )
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
  (scope, params: [TaggedReaderForm, TaggedReaderForm, TaggedReaderForm?]) => {
    const [cond, trueBranch, falseBranch] = params;
    const condResult = evaluate(scope, cond);
    if (didEvalFail(condResult)) {
      return condResult
    }
    else if (condResult) {
      return evaluate(scope, trueBranch);
    }
    else {
      return (isDefined(falseBranch))
        ? evaluate(scope, falseBranch)
        : null;
    }
  }
);


/**
 * Monalisp `SpecialForm` that returns first falsy-value, or last truthy-value.
 */
export const and = SpecialForm.of(
  Signature.of(['forms', Flag.Any, Rest]),
  (scope, [forms]: [TaggedReaderForm[]]) => {
    let result: EvalResult = null;
    for (const form of forms) {
      result = evaluate(scope, form);
      if (didEvalFail(result) || not(result)) {
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
  (scope, [forms]: [TaggedReaderForm[]]) => {
    let result: EvalResult = null;
    for (const form of forms) {
      result = evaluate(scope, form);
      if (didEvalFail(result) || Boolean(result)) {
        return result;
      }
    }
    return result;
  }
);
