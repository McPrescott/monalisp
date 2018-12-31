// -----------------------------------------------------------------------------
// -- SPECIAL FORM CLASS
//------------------------------------------------------------------------------


// TODO: Auto-curry when number of parameters is less than arity


import {formFlagName} from '../../common/form-flag';
import {EvalFailure, didEvalFail} from '../eval-failure';
import {Callable} from './callable';


/**
 * Representation of single `SpecialForm` parameter.
 */
type Parameter = [string, number, boolean?];


/**
 * List of parameters after application to `Signature`.
 */
type ParameterList = (TaggedReaderForm | TaggedReaderForm[])[];


/**
 * Function body of a `SpecialForm`.
 */
type Body = (scope: ScopeStackType, parameters: ParameterList) => (
  EvalResult
);


/**
 * Represents the signature of a `SpecialForm`
 */
export class Signature {
  
  /**
   * Static factory function of `Signature`.
   */
  static of(spec: Parameter[], hasRest=false) {
    return new Signature(spec, hasRest);
  }

  public arity: number;
  constructor(public spec: Parameter[], public hasRest=false) {
    this.arity = (hasRest) ? spec.length-1 : spec.length;
  }

  apply(parameters: TaggedReaderForm[]) {
    // Check arity
    if (!this.hasRest && parameters.length > this.arity) {
      const message = `Too many parameters. Expected ${this.arity}, got ${parameters.length}.`;
      return EvalFailure.of(message);
    }

    // Type check parameters
    for (let i=0; i<parameters.length; i++) {
      let parameter = parameters[i];
      let [name, type] = this.spec[Math.min(i, this.arity)];
      if (!(parameter.type & type)) {
        const {info} = parameter;
        const expectedType = formFlagName(type);
        const givenType = formFlagName(parameter.type);
        const message = `Incorrect type for "${name}" parameter. Expected` 
                      + `${expectedType}, got ${givenType}.`;
        return EvalFailure.of(message, info);
      }
    }

    // Return parameter list
    return (this.hasRest)
      ? [...parameters.slice(0, this.arity), parameters.slice(this.arity)]
      : parameters;
  }
}



/**
 * Monalisp's `SpecialForm` class.
 */
export class SpecialForm extends Callable implements SpecialFormType {

  /**
   * Static factory function of `SpecialForm`.
   */
  static of(signature: Signature, body: Body) {
    return new SpecialForm(signature, body);
  }

  constructor(public signature: Signature, public body: Body) {
    super();
  }

  call(scope: ScopeStackType, parameters: TaggedReaderForm[]) {
    const parameterList = this.signature.apply(parameters);
    if (didEvalFail(parameterList)) {
      return parameterList
    }
    return this.body(scope, parameterList);
  }
}
