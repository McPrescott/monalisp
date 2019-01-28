// -----------------------------------------------------------------------------
// -- BUILTIN PROCEDURE CLASS
//------------------------------------------------------------------------------


import {variable, vsrc} from '../../../common/variable';
import {Callable} from './callable';
import {didEvalFail} from '../../eval-failure';

import {rbind} from '../../misc';
import {Signature, verifyArity, verifyTypes, partial} from './common-signature';


/**
 * Body of a `BuiltinProcedure`.
 */
type Body = (env: ScopeStackType, ...paramters: VarType[]) => EvalResult;


/**
 * Partially apply given arguments to `BuiltinProcedure` body funciton.
 */
const bindParameters = (fn: Body, set1: VarType[]) => (
  (scope: ScopeStackType, ...set2: VarType[]) => (
    fn(scope, ...set1, ...set2)
  )
);



export class BuiltinProcedure extends Callable {

  static of(signature: Signature, body: Body) {
    return new BuiltinProcedure(signature, body);
  }

  constructor(public signature: Signature, public body: Body) {
    super();
  }

  get shouldEvaluateParameters() {
    return true;
  }

  call(scope: ScopeStackType, list: ListVar) {
    // Evaluate given *parameters*
    const parameters = rbind(
      verifyArity(this.signature, list.form),
      verifyTypes(this.signature)
    );
    if (didEvalFail(parameters)) {
      return parameters;
    }

    // Curry if parameter length is less than arity
    const {minArity} = this.signature;
    if (parameters.length < minArity) {
      const signature = partial(this.signature, parameters.length);
      if (didEvalFail(signature)) {
        return signature;
      }
      const body = bindParameters(this.body, parameters);
      return variable(BuiltinProcedure.of(signature, body), list.src);
    }

    // Invoke funciton if it has sufficient arguments
    const result = this.body(scope, ...parameters);
    if (didEvalFail(result)) {
      return result;
    }
    return vsrc(result, list.src);
  }
}
