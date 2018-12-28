// -----------------------------------------------------------------------------
// -- PROCEDURE CLASS
//------------------------------------------------------------------------------


import {last, zip} from '../../~hyfns/list';
import {Callable} from './callable';
import {Scope} from './scope';
import {EvalFailure, didEvalFail} from '../eval-failure';
import {evaluateSequence} from '../evaluator';


/**
 * Monalisp function class. Has been named `Procedure` to disambiguate from
 * JavaScript's builtin `Function` class.
 */
export class Procedure extends Callable implements ProcedureType {

  /**
   * Static factory function of `Procedure`.
   */
  static of(closure: ScopeStackType, signature: IdentifierType[], body: TaggedReaderForm[]) {
    return new Procedure(closure, signature, body);
  }

  constructor(
    public closure: ScopeStackType,
    public signature: IdentifierType[],
    public body: TaggedReaderForm[]
  ) { super(); }

  /**
   * Call this `Procedure` with given *scope* and *parameters*.
   */
  call(scope: ScopeStackType, parameters: TaggedReaderForm[]) {
    // Ensure parameters is less than arity
    const arity = this.signature.length;
    const parameterLength = parameters.length;
    if (parameterLength > arity) {
      const message = `Too many parameters. Expected ${arity}, got `
                    + `${parameterLength}`;
      return EvalFailure.of(message);
    }
    
    // Evaluate given *parameters*
    const evaluatedParameters = evaluateSequence(scope, parameters);
    if (didEvalFail(evaluatedParameters)) {
      return evaluatedParameters;
    }

    // Bind *evaluatedParameters* to *this.signature*
    const parameterList = Scope.of(zip(this.signature, evaluatedParameters));
    const closure = this.closure.push(parameterList);
    if (parameterLength < arity) {
      const signature = this.signature.slice(parameterLength);
      const {body} = this;
      return Procedure.of(closure, signature, body);
    }

    // Sequentially execute forms in *this.body* with *closure*
    const results = evaluateSequence(closure, this.body);
    if (didEvalFail(results)) {
      return results;
    }
    return last(results);
  }
}
