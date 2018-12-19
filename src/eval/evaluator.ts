// -----------------------------------------------------------------------------
// -- MONALISP EVALUATOR
//------------------------------------------------------------------------------


import {head, tail, zip} from '../~hyfns/list';
import {ReaderFormFlag} from '../read/tagging';
import {Procedure} from './type/procedure';
import {SpecialForm} from './type/special-form';
import {Scope} from './scope';


/**
 * Represents `Evaluator` error.
 */
export class EvalFailure implements EvalFailureType {

  /**
   * Static factory function for `EvalFailure`.
   */
  static of(message: string, info?: CharStream.Info, trace?: StackTraceType): EvalFailureType {
    return new EvalFailure(message, info, trace);
  };

  constructor(
    public message: string, 
    public info?: CharStream.Info, 
    public trace?: StackTraceType
  ) {};

  toString() {
    return this.message;
  }
}



/**
 * Wrapper around an `EvalFunctionType`.
 */
export class Evaluator<T extends TaggedReaderForm, U extends EvalForm> implements EvaluatorType<T, U> {
  
  /**
   * Static factory function for `Evaluator`.
   */
  static of<T extends TaggedReaderForm, U extends EvalForm>(run: EvalFunctionType<T, U>) {
    return new Evaluator(run);
  }
  
  constructor(public run: EvalFunctionType<T, U>) {}
}


/**
 * Return whether evaluation failed.
 */
export const didEvalFail = <T>(form: EvalResult<T>): form is EvalFailure => (
  form instanceof EvalFailure
);


/**
 * Return whether evaluation succeeded.
 */
export const didEvalSucceed = <T>(form: EvalResult<T>): form is T => (
  !(form instanceof EvalFailure)
);


/**
 * Root `Evaluator`, delegating `ReaderForm` to corresponding `Evaluator`.
 */
export const evalForm: Evaluator<TaggedReaderForm, EvalForm> = (
  Evaluator.of<TaggedReaderForm, EvalForm>((scope, form) => {
    switch (form.type) {
      case ReaderFormFlag.Identifier:
        return evalIdentifier.run(scope, form as TaggedIdentifierType);
      case ReaderFormFlag.List:
        return evalFunction.run(scope, form as TaggedReaderListType);
      case ReaderFormFlag.Dictionary:
        return evalDictionary.run(scope, form as TaggedReaderDictionaryType);
      default:
        return passThrough.run(scope, form as ReaderTagType<SelfEvaluatingForm>);
    }
  })
);


/**
 * `Evaluator` for a `SelfEvaluatingForm` (a form that evaluates to itself),
 * which can be any of `nil`, `boolean`, `number`, `string` or `Keyword`.
 */
export const passThrough = Evaluator.of(
  (scope, form: ReaderTagType<SelfEvaluatingForm>) => (
    form.expression
  )
);


/**
 * `Evaluator` for an `Identifier`, resolving identifier's bounded value in the
 * given scope.
 */
export const evalIdentifier = Evaluator.of(
  (scope, tagged: TaggedIdentifierType) => (
    scope.resolve(tagged.expression)
  )
);


/**
 * `Evaluator` for `ReaderListType`, that invokes the first element with
 * subsequent elements as parameters.
 */
export const evalFunction = Evaluator.of(
  (scope, list: TaggedReaderListType) => {
    const fn: EvalResult<EvalForm> = evalForm.run(scope, head(list.expression));
    if (didEvalFail(fn)) {
      return fn;
    }
    let arglist = tail(list.expression);
    if (fn instanceof Procedure) {
      // evaluate list of arguments
      let evaledArglist = evalArgumentList(scope, arglist);
      if (didEvalFail(evaledArglist))
        return evaledArglist;
      // bind evaluated arguments to scope and execute body
      let functionScope = scope.push(
        Scope.of(zip(fn.signature, evaledArglist))
      );
      let result: EvalResult<EvalForm>;
      for (let expression of fn.body) {
        result = evalForm.run(functionScope, expression);
        if (didEvalFail(result))
          // TODO: Add stack frame
          return result;
      }
      return result;
    }
    else if (fn instanceof SpecialForm) {
      return fn.body(scope, arglist);
    }
    return EvalFailure.of(`Cannot invoke ${fn} as a function.`);
  }
);


/**
 * Evaluates list of arugments in order of appearance.
 */
export const evalArgumentList = (
  (scope: ScopeStackType, argumentList: TaggedReaderForm[]): EvalResult<EvalForm[]> => {
    let evaluatedArguments: EvalForm[] = [];
    for (let argument of argumentList) {
      let evaluatedArgument = evalForm.run(scope, argument);
      if (didEvalFail(evaluatedArgument))
        return evaluatedArgument;
      evaluatedArguments.push(evaluatedArgument);
    }
    return evaluatedArguments;
  }
);


/**
 * `Evaluator` for `ReaderDictionaryType`, evaluting each contained expression,
 * and returning a new `Map` of the results.
 */
export const evalDictionary = Evaluator.of((scope, form: TaggedReaderDictionaryType) => {
  let dictionary = new Map<EvalForm, EvalForm>();
  for (let pair of form.expression) {
    let key = evalForm.run(scope, pair[0]);
    if (didEvalFail(key))
      return key;
    let value = evalForm.run(scope, pair[1]);
    if (didEvalFail(value))
      return value;
    dictionary.set(key, value);
  }
  return dictionary;
});