// -----------------------------------------------------------------------------
// -- MONALISP SPECIAL-FORMS
//------------------------------------------------------------------------------


import {Identifier} from '../../common/identifier';
import {FormFlag as Flag} from '../../common/form-flag';
import {EvalFailure, didEvalFail} from '../eval-failure';
import {evaluate} from '../evaluator';
import {Procedure} from '../type/procedure';
import {SpecialForm, Signature} from '../type/special-form';


const signature = (...parameters: [string, number][]) => (
  Signature.of(parameters, false)
);

const variadic = (...parameters: [string, number][]) => (
  Signature.of(parameters, true)
);


/**
 * Monalisp `SpecialForm` for binding an `EvalForm` to an `Identifier`.
 */
export const def = SpecialForm.of(
  signature(['id', Flag.Identifier], ['form', Flag.Any]),
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
  variadic(['args', Flag.List], ['exprs', Flag.List]),
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
