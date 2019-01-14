// -----------------------------------------------------------------------------
// -- CALLABLE SIGNATURE
//------------------------------------------------------------------------------


import {curry} from '../../../~hyfns';
import {FormFlag, formFlagName, isNotTypeMatch} from '../../../common/form-flag';
import {EvalFailure} from '../../eval-failure';


export enum ParameterKind {
  // Begin at one so no values are falsy
  Required=1,
  Optional=2,
  Rest=3
}


/**
 * Short-hand representation of `ParameterDescriptor`.
 */
type Parameter = string | [string, number?, ParameterKind?];


/**
 * Describes single parameter of a `Callable`.
 */
type ParameterDescriptor = {
  name: string,
  type: number,
  kind: ParameterKind
};


/**
 * Convert short-hand `Parameter` to `ParameterDescriptor`.
 */
const descriptorFrom = (
  (parameter: Parameter|ParameterDescriptor): ParameterDescriptor => (
    (!Array.isArray(parameter) && parameter instanceof Object) ? parameter
    : (Array.isArray(parameter))
      ? {
        name: parameter[0],
        type: (parameter[1] || FormFlag.Any),
        kind: (parameter[2] || ParameterKind.Required)
      } : {
        name: parameter,
        type: FormFlag.Any,
        kind: ParameterKind.Required
      }
  )
);


/**
 * Represents the signature of `SpecialForm` or `BuiltinProcedure`.
 */
export class Signature {
  
  /**
   * Static factory function of `Signature`.
   */
  static of(...spec: (Parameter|ParameterDescriptor)[]) {
    return new Signature(...spec);
  }

  public minArity: number;
  public maxArity: number;
  public spec: ParameterDescriptor[]
  constructor(...spec: (Parameter|ParameterDescriptor)[]) {
    this.spec = [];
    this.minArity = 0;
    this.maxArity = 0;
    let anyOptional = false;
    let anyRest = false;
    for (const parameter of spec) {
      const descriptor = descriptorFrom(parameter);
      const {kind} = descriptor;
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
        break;
      }
      this.spec.push(descriptor);
    }
  }

  bind(n: number) {
    return Signature.of(...this.spec.slice(n));
  }
}





/**
 * Returns `EvalFailure` if more parameters than the given *signature*'s maximum
 * arity are provided.
 */
export const verifyArity: VerifyArity = curry(
  ({maxArity}: Signature, parameters: VarType[]) => {
    const parameterLength = parameters.length;
    if (parameterLength > maxArity) {
      const message = `Too many parameters. Expected at most ${maxArity}, `
                    + `got ${parameterLength}.`;
      return EvalFailure.of(message);
    }
    return parameters;
  }
);

interface VerifyArity {
  (signature: Signature, parameters: VarType[]):
    EvalResult<VarType[]>;
  
  (signature: Signature): (parameters: VarType[]) =>
    EvalResult<VarType[]>;
}


/**
 * Verify that the types of the provided *parameters* match given *signature*.
 */
export const typeCheck: TypeCheck = curry(
  <T extends VarType[]>
  ({spec}: Signature, parameters: T): EvalResult<T> => {
    for (let i=0; i<parameters.length; i++) {
      const parameter = parameters[i];
      const {type} = parameter;
      const {name, type: expectedType} = spec[Math.min(i, spec.length-1)];
      if (isNotTypeMatch(type, expectedType)) {
        const {src} = parameter; 
        const expectedTypeName = formFlagName(expectedType);
        const givenTypeName = formFlagName(type);
        const message = `Incorrect type for "${name}" parameter. Expected` 
                      + `${expectedTypeName}, got ${givenTypeName}.`;
        return EvalFailure.of(message, src);
      }
    }
    return parameters;
  }
);

interface TypeCheck {
  <T extends VarType[]>(signature: Signature, parameters: T): EvalResult<T>;
  (signature: Signature): <T extends VarType[]>(parameters: T) => EvalResult<T>;
}


// /**
//  * Transform argument list for either `SpecialForm` or `BuiltinProcedure`.
//  */
// export const transform: Transform = curry(
//   <T extends TaggedReaderForm | EvalForm>
//   ({spec}: Signature, parameters: T[]): (T | T[])[] => {
//     const parameterList: (T | T[])[] = [];
//     for (let i=0; i<parameters.length; i++) {
//       const kind = spec[i].kind;
//       if (kind !== ParameterKind.Rest) {
//         parameterList.push(parameters[i]);
//       }
//       else {
//         parameterList.push(parameters.slice(i));
//         break;
//       }
//     }
//     return parameterList;
//   }
// );

// interface Transform {
//   <T extends TaggedReaderForm|EvalForm>(signature: Signature, parameters: T[]): (T | T[])[];
//   (signature: Signature): <T extends TaggedReaderForm|EvalForm>(parameters: T[])=> (T | T[])[];
// }