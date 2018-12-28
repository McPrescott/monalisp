// -----------------------------------------------------------------------------
// -- BUILTIN PROCEDURE CLASS
//------------------------------------------------------------------------------


import {formFlagOf, formFlagName} from '../../common/form-flag';
import {Callable} from './callable';
import {EvalFailure, didEvalFail} from '../eval-failure';
import {evaluateSequence} from '../evaluator';


/**
 * Represents single parameter of a `BuiltinProcedure`.
 */
type Parameter = [string, number];


/**
 * Body of a `BuiltinProcedure`.
 */
type Body = (...paramters: EvalForm[]) => EvalForm;


/**
 * Represents the signature of a `BuiltinProcedure`.
 */
export class Signature {

  /**
   * Static factory function of `Signature`.
   */
  static of(spec: Parameter[], hasRest=false) {
    return new Signature(spec, hasRest);
  }

  public arity: number;
  constructor(public spec: Parameter[], public hasRest: boolean) {
    this.arity = (hasRest) ? spec.length-1 : spec.length;
  }

  apply(scope: ScopeStackType, parameters: TaggedReaderForm[]) {
    // Check length of parameters against arity
    const parameterLength = parameters.length;
    if (!this.hasRest && parameterLength > this.arity) {
      const message = `Too many arguments. Expecting ${this.arity}, got `
                    + `${parameterLength}.`;
      return EvalFailure.of(message);
    }

    // Sequentially evaluate *parameters*
    const evaluatedParameters = evaluateSequence(scope, parameters);
    if (didEvalFail(evaluatedParameters)) {
      return evaluatedParameters;
    }

    // Type check *evaluatedParameters* against *this.spec*
    for (let i=0; i<parameterLength; i++) {
      const form = evaluatedParameters[i];
      const [name, type] = this.spec[i];
      const formType = formFlagOf(form);
      if (!(formType & type)) {
        const expectedType = formFlagName(type);
        const receivedType = formFlagName(formType);
        const message = `Incorrect type for "${name}" parameter. Expected `
                      + `${expectedType}, got ${receivedType}`;
        const {info} = parameters[i];
        return EvalFailure.of(message, info);
      }
    }

    return evaluatedParameters;
  }

  bind(n: number) {
    return Signature.of(this.spec.slice(0, n), this.hasRest);
  }
}



export class BuiltinProcedure extends Callable {

  static of(signature: Signature, body: Body) {
    return new BuiltinProcedure(signature, body);
  }

  constructor(public signature: Signature, public body: Body) {
    super();
  }

  call(scope: ScopeStackType, parameters: TaggedReaderForm[]): EvalResult {
    // Evaluate given *parameters*
    const evaluatedParameters = this.signature.apply(scope, parameters);
    if (didEvalFail(evaluatedParameters)) {
      return evaluatedParameters;
    }

    // Curry if parameter length is less than arity
    const {arity} = this.signature;
    const parameterLength = parameters.length;
    if (parameterLength < arity) {
      const signature = this.signature.bind(parameterLength);
      const body = this.body.bind(null, ...evaluatedParameters);
      return BuiltinProcedure.of(signature, body);
    }

    // Invoke *this.body* with *evaluatedParameters*
    return this.body(...evaluatedParameters);
  }
}
