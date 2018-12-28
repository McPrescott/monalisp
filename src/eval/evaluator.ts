// -----------------------------------------------------------------------------
// -- MONALISP EVALUATOR
//------------------------------------------------------------------------------


import {head, tail} from '../~hyfns/list';
import {FormFlag} from '../common/form-flag';
import {EvalFailure, didEvalFail} from './eval-failure';
import {Callable} from './type/callable';


/**
 * Evaluates single reader form.
 */
export const evaluate: EvalFn = (scope, form) => {
  switch (form.type) {
    case FormFlag.Identifier:
      return evalIdentifier(scope, form as TaggedIdentifierType);
    case FormFlag.List:
      return evalList(scope, form as TaggedReaderListType);
    case FormFlag.Dictionary:
      return evalDictionary(scope, form as TaggedReaderDictionaryType);
    default:
      return evalPrimitive(scope, form as TaggedPrimitive);
  }
}


/**
 * Evaluate primitive form, where primitive means a form that evaluates to
 * itself. Primitive forms are: `nil`, `boolean`, `number`, `string` and
 * `Keyword`.
 */
export const evalPrimitive: EvalFn<TaggedPrimitive, Primitive> = (
  (_, form) => (
    form.expression
  )
);


/**
 * Evaluates `Identifier` by resolving its value from given *scope*.
 */
export const evalIdentifier: EvalFn<TaggedIdentifierType> = (scope, id) => (
  scope.resolve(id.expression)
);


/**
 * Evaluates `List` by invoking the first element of *taggedList* as a
 * `Procedure`, with the subsequent elements as its arguments.
 */
export const evalList: EvalFn<TaggedReaderListType> = (scope, taggedList) => {
  // Retrieve procedure (first element) from expression
  const list = taggedList.expression;
  const fn = evaluate(scope, head(list));
  if (didEvalFail(fn)) {
    return fn;
  }

  // Ensure fn is derrived from `Callable`
  if (!(fn instanceof Callable)) {
    const {info} = taggedList;
    const message = `Cannot invoke ${fn} as a procedure.`
    return EvalFailure.of(message, info);
  }

  // Call `Callable` instance with subsequent elements of *list*
  return fn.call(scope, tail(list));
};


/**
 * Evaluates `Dictionary` by sequentially evaluating each of its key, value
 * pairs respectively.
 */
export const evalDictionary: EvalFn<TaggedReaderDictionaryType, DictionaryType> = (
  (scope, taggedDictionary) => {
    let result: DictionaryType;
    for (let [taggedKey, taggedValue] of taggedDictionary.expression) {
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
    return result;
  }
);



// -- Helpers ------------------------------------------------------------------


/**
 * Evaluates *sequence* of reader forms, returning `EvalFailure` immediately
 * upon failure, or an `EvalForm[]` upon success.
 */
export const evaluateSequence = (
  (scope: ScopeStackType, sequence: TaggedReaderForm[]) => {
    const results: EvalForm[] = [];
    for (const form of sequence) {
      const result = evaluate(scope, form);
      if (didEvalFail(result))
        return result;
      results.push(result);
    }
    return results;
  }
);