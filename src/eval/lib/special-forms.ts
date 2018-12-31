// -----------------------------------------------------------------------------
// -- MONALISP SPECIAL-FORMS
//------------------------------------------------------------------------------


import {Identifier} from '../../common/identifier';
import {FormFlag as Flag} from '../../common/form-flag';
import {EvalFailure, didEvalFail} from '../eval-failure';
import {evaluate} from '../evaluator';
import {Procedure} from '../type/procedure';
import {SpecialForm, Signature, ParameterKind} from '../type/special-form';


const {Required, Optional, Rest} = ParameterKind;


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
  Signature.of(['args', Flag.List], ['exprs', Flag.List, Rest]),
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
 * Monalisp conditional `SpecialForm`.
 */
export const if_ = SpecialForm.of(
  Signature.of(
    ['cond', Flag.Any],
    ['true-branch', Flag.Any],
    ['false-branch', Flag.Any, Optional]
  ),
  (scope, [cond, trueBranch, falseBranch]: [TaggedReaderForm, TaggedReaderForm, TaggedReaderForm?]) => {
    const condResult = evaluate(scope, cond);
    if (didEvalFail(condResult)) {
      return condResult
    }
    else if (condResult) {
      return evaluate(scope, trueBranch);
    }
    else if (falseBranch === undefined) {
      return null;
    }
    else {
      return evaluate(scope, falseBranch);
    }
  }
);
