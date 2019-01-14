// -----------------------------------------------------------------------------
// -- PROCEDURE CLASS
//------------------------------------------------------------------------------


import {last, zip} from '../../../~hyfns/list';
import {Callable} from './callable';
import {Scope} from '../scope';
import {EvalFailure, didEvalFail} from '../../eval-failure';
import {evaluateSequence} from '../../evaluator';
import { variable } from '../../../common/variable';


/**
 * Monalisp function class. Has been named `Procedure` to disambiguate from
 * JavaScript's builtin `Function` class.
 */
export class Procedure extends Callable {

  /**
   * Static factory function of `Procedure`.
   */
  static of(closure: ScopeStackType, signature: IdentifierType[], body: VarType[]) {
    return new Procedure(closure, signature, body);
  }

  constructor(
    public closure: ScopeStackType,
    public signature: IdentifierType[],
    public body: VarType[]
  ) { super(); }

  get shouldEvaluateParameters() {
    return true;
  }

  call(_, list: ListVar) {
    // Ensure parameters is less than arity
    const arity = this.signature.length;
    const parameters = list.expr;
    const parameterLength = parameters.length;
    if (parameterLength > arity) {
      return EvalFailure.of(
        `Too many parameters. Expected ${arity}, got ${parameterLength}`
      );
    }

    // Bind parameters to new top level scope
    const parameterList = Scope.of(zip(this.signature, parameters));
    const closure = this.closure.push(parameterList);
    if (parameterLength < arity) {
      const signature = this.signature.slice(parameterLength);
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
