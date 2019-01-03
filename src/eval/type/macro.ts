// -----------------------------------------------------------------------------
// -- MONALISP MACRO TYPE
//------------------------------------------------------------------------------



import {last, zip} from '../../~hyfns/list';
import {stripExpression, tagExpanded} from '../misc';
import {Callable} from './callable';
import {Scope} from './scope';
import {EvalFailure, didEvalFail} from '../eval-failure';
import {evaluateSequence, evaluate} from '../evaluator';


/**
 * Monalisp Macro class.
 */
export class Macro extends Callable {

  /**
   * Static factory function of `Procedure`.
   */
  static of(closure: ScopeStackType, signature: IdentifierType[], body: TaggedReaderForm[]) {
    return new Macro(closure, signature, body);
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
    const evaluatedParameters = parameters.map(stripExpression);

    // Bind *evaluatedParameters* to *this.signature*
    const parameterList = Scope.of(zip(this.signature, evaluatedParameters));
    const closure = this.closure.push(parameterList);
    if (parameterLength < arity) {
      const signature = this.signature.slice(parameterLength);
      const {body} = this;
      return Macro.of(closure, signature, body);
    }

    // Sequentially execute forms in *this.body* with *closure*
    const results = evaluateSequence(closure, this.body);
    if (didEvalFail(results)) {
      return results;
    }

    // FIX: Tagged at first parameter instead of macro location
    // Evaluate the forms returned from the macro
    const taggedResult = tagExpanded(last(results), parameters[0].info);
    if (didEvalFail(taggedResult)) {
      return taggedResult
    }
    return evaluate(scope, taggedResult);
  }
}