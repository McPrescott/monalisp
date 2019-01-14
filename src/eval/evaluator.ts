// -----------------------------------------------------------------------------
// -- MONALISP EVALUATOR
//------------------------------------------------------------------------------


import {curry} from '../~hyfns';
import {head, tail} from '../~hyfns/list';
import {FormFlag} from '../common/form-flag';
import {variableFrom} from '../common/variable';
import {isNotCallable} from '../common/variable-type-guards';
import {EvalFailure, didEvalFail} from './eval-failure';



/**
 * Evaluates single reader form.
 */
export const evaluate: EvalFn = (scope, form) => {
  switch (form.type) {
    case FormFlag.Identifier:
      return evalIdentifier(scope, form);
    case FormFlag.List:
      return evalList(scope, form);
    case FormFlag.Dictionary:
      return evalDictionary(scope, form);
    default:
      return evalPrimitive(scope, form);
  }
};


/**
 * Evaluate primitive form, where primitive means a form that evaluates to
 * itself. Primitive forms are: `nil`, `boolean`, `number`, `string` and
 * `Keyword`.
 */
export const evalPrimitive: EvalFn = (
  (_, form) => form
);


/**
 * Evaluates `Identifier` by resolving its value from given *scope*.
 */
export const evalIdentifier: EvalFn<IdentifierVar> = (scope, id) => (
  scope.resolve(id.expr)
);


/**
 * Evaluates `List` by invoking the first element of *taggedList* as a
 * `Procedure`, with the subsequent elements as its arguments.
 */
export const evalList: EvalFn<ListVar> = (scope, varList) => {
  // Retrieve procedure (first element) from expression
  const list = varList.expr;
  const fn = evaluate(scope, head(list));
  if (didEvalFail(fn)) {
    return fn;
  }

  // Ensure fn is derrived from `Callable`
  if (isNotCallable(fn)) {
    const {src} = varList;
    const message = `Cannot invoke ${fn} as a procedure.`
    return EvalFailure.of(message, src);
  }

  // Call function, evaluating parameters if necessary
  const callable = fn.expr;
  let parameters = tail(list);
  if (callable.shouldEvaluateParameters) {
    const evaluatedParameters = evaluateSequence(scope, tail(list))
    if (didEvalFail(evaluatedParameters))
      return evaluatedParameters;
    parameters = evaluatedParameters
  }
  return callable.call(scope, variableFrom(parameters, varList) as ListVar);
};


/**
 * Evaluates `Dictionary` by sequentially evaluating each of its key, value
 * pairs respectively.
 */
export const evalDictionary: EvalFn<DictionaryVar, DictionaryVar> = (
  (scope, dictionary) => {
    let result: DictionaryType;
    for (let [taggedKey, taggedValue] of dictionary.expr) {
      // Evaluate *key*
      let key = evaluate(scope, taggedKey);
      if (didEvalFail(key)) {
        return key;
      }

      // Evaluate *value*
      let value = evaluate(scope, taggedValue);
      if (didEvalFail(value)) {
        return value;
      }

      // Add *key*, *value* pair to *result*
      result.set(key, value);
    }
    return variableFrom(result, dictionary) as DictionaryVar;
  }
);



// -- Helpers ------------------------------------------------------------------


/**
 * Evaluates *sequence* of reader forms, returning `EvalFailure` immediately
 * upon failure, or an `EvalForm[]` upon success.
 */
export const evaluateSequence = curry(
  (scope: ScopeStackType, sequence: VarType[]) => {
    const results: VarType[] = [];
    for (const form of sequence) {
      const result = evaluate(scope, form);
      if (didEvalFail(result))
        return result;
      results.push(result);
    }
    return results;
  }
);
