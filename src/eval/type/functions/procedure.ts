// -----------------------------------------------------------------------------
// -- PROCEDURE CLASS
//------------------------------------------------------------------------------


import {last} from '../../../~hyfns/list';
import {variable} from '../../../common/variable';
import {Callable} from './callable';
import {Scope} from '../scope';
import {didEvalFail} from '../../eval-failure';
import {evaluateSequence} from '../../evaluator';

import {Signature, verifyArity, partial, assocParams} from './common-signature';


/**
 * Monalisp function class. Has been named `Procedure` to disambiguate from
 * JavaScript's builtin `Function` class.
 */
export class Procedure extends Callable {

  /**
   * Static factory function of `Procedure`.
   */
  static of(closure: ScopeStackType, signature: Signature, body: VarType[]) {
    return new Procedure(closure, signature, body);
  }

  constructor(
    public closure: ScopeStackType,
    public signature: Signature,
    public body: VarType[]
  ) { super(); }

  get shouldEvaluateParameters() {
    return true;
  }

  call(_, list: ListVar) {
    const parameters = verifyArity(this.signature, list.expr);
    if (didEvalFail(parameters)) {
      return parameters;
    }

    // Bind parameters to new top level scope
    const parameterList = Scope.of(assocParams(this.signature, parameters));
    const closure = this.closure.push(parameterList);
    if (parameters.length < this.signature.minArity) {
      const signature = partial(this.signature, parameters.length);
      if (didEvalFail(signature)) {
        return signature;
      }
      return variable(Procedure.of(closure, signature, this.body), list.src);
    }

    // Sequentially execute forms in *this.body* with *closure*
    const results = evaluateSequence(closure, this.body);
    if (didEvalFail(results)) {
      return results;
    }
    return last(results);
  }
}
