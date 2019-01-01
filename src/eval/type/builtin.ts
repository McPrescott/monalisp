// -----------------------------------------------------------------------------
// -- BUILTIN PROCEDURE CLASS
//------------------------------------------------------------------------------


import {apply} from '../../~hyfns';
import {formFlagOf, formFlagName} from '../../common/form-flag';
import {Callable} from './callable';
import {EvalFailure, didEvalFail} from '../eval-failure';
import {evaluateSequence} from '../evaluator';
import {bind} from './bind';
import {Signature, verifyArity, typeCheck, transform} from './signature';


/**
 * Body of a `BuiltinProcedure`.
 */
type Body = (...paramters: EvalForm[]) => EvalForm;


export class BuiltinProcedure extends Callable {

  static of(signature: Signature, body: Body) {
    return new BuiltinProcedure(signature, body);
  }

  constructor(public signature: Signature, public body: Body) {
    super();
  }

  call(scope: ScopeStackType, parameters: TaggedReaderForm[]): EvalResult {
    // Evaluate given *parameters*
    const evaluatedParameters = apply(parameters, bind(
      verifyArity(this.signature),
      (parameters) => evaluateSequence(scope, parameters),
      typeCheck(this.signature),
      transform(this.signature)
    ));
    if (didEvalFail(evaluatedParameters)) {
      return evaluatedParameters;
    }

    // Curry if parameter length is less than arity
    const {minArity} = this.signature;
    const parameterLength = parameters.length;
    if (parameterLength < minArity) {
      const signature = this.signature.bind(parameterLength);
      const body = this.body.bind(null, ...evaluatedParameters);
      return BuiltinProcedure.of(signature, body);
    }

    // Invoke *this.body* with *evaluatedParameters*
    return this.body(...evaluatedParameters as EvalForm[]);
  }
}
