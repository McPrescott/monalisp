// -----------------------------------------------------------------------------
// -- SPECIAL FORM CLASS
//------------------------------------------------------------------------------


// TODO: Auto-curry when number of parameters is less than arity


import {formFlagName} from '../../common/form-flag';
import {EvalFailure, didEvalFail} from '../eval-failure';
import {Callable} from './callable';


export enum ParameterKind {
  // Begin at one so no values are falsy
  Required=1,
  Optional=2,
  Rest=3
}


/**
 * Representation of single `SpecialForm` parameter.
 */
type Parameter = [string, number, ParameterKind?];


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
  static of(...spec: Parameter[]) {
    return new Signature(...spec);
  }

  public minArity: number;
  public maxArity: number;
  public spec: Parameter[]
  constructor(...spec: Parameter[]) {
    this.spec = spec;
    this.minArity = 0;
    this.maxArity = 0;
    let anyOptional = false;
    let anyRest = false;
    for (const parameter of spec) {
      const kind = parameter[2] || (parameter[2] = ParameterKind.Required);
      switch (kind) {
        case ParameterKind.Required:
          if (anyOptional || anyRest) {
            const message = 'Required parameters cannot be preceeded by '
                          + 'Optional or Rest parameters.';
            throw new Error(message);
          }
          this.minArity++;
          this.maxArity++;
        break;
        case ParameterKind.Optional:
          if (anyRest) {
            const message = 'Optional parameters cannot be preceeded by a Rest '
                          + 'parameter.';
            throw new Error(message);
          }
          anyOptional = true;
          this.maxArity++;
        break;
        case ParameterKind.Rest:
          if (anyRest) {
            const message = 'Signatures cannot contain more than one rest '
                          + 'parameter.'
            throw new Error(message);
          }
          anyRest = true;
          this.maxArity = Infinity;
      }
    }
  }

  apply(parameters: TaggedReaderForm[]) {
    // Check arity
    const parameterLength = parameters.length;
    if (parameterLength > this.maxArity) {
      const message = `Too many parameters. Expected at most ${this.maxArity}, `
                    + `got ${parameterLength}.`;
      return EvalFailure.of(message);
    }

    // Type check parameters
    for (let i=0; i<parameters.length; i++) {
      let parameter = parameters[i];
      let [name, type] = this.spec[Math.min(i, this.spec.length-1)];
      if (!(parameter.type & type)) {
        const {info} = parameter;
        const expectedType = formFlagName(type);
        const givenType = formFlagName(parameter.type);
        const message = `Incorrect type for "${name}" parameter. Expected` 
                      + `${expectedType}, got ${givenType}.`;
        return EvalFailure.of(message, info);
      }
    }

    // Convert parameters for special-form consumption
    const parameterList: ParameterList = [];
    for (let i=0; i<parameterLength; i++) {
      const kind = this.spec[i][2];
      if (kind !== ParameterKind.Rest) {
        parameterList.push(parameters[i]);
      }
      else {
        parameterList.push(parameters.slice(i));
      }
    }
    return parameterList;
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
