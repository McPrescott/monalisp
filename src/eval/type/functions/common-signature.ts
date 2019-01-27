// -----------------------------------------------------------------------------
// -- FUNCTION SIGNATURE
//------------------------------------------------------------------------------


import {curry} from '../../../~hyfns/curry';
import {zipLong} from '../../../~hyfns/list';
import {getIdentifier as idOf} from '../../../common/identifier';
import {FormFlag as Type, isNotTypeMatch, formFlagName as typeName} from '../../../common/form-flag';
import {vlift} from '../../../common/variable';
import {EvalFailure, didEvalFail} from '../../eval-failure';
import {isIdentifier, isKeyword, isNotIdentifier} from '../../../common/variable-type-guards';


type ParameterDescriptor = string | [string, number?, Modifier?];

export enum Modifier {
  Required = 1,
  Optional = 2,
  Rest = 3
}

interface Parameter {
  id: IdentifierVar;
  modifier: Modifier;
  type: number;
}

// Lift this interface into typings... Modifier must be union of `1 | 2 | 3` if
// I am not mistaken
export interface Signature {
  parameters: Parameter[];
  minArity: number;
  maxArity: number;
}


/**
 * Lift string to an `IdentifierVar`.
 */
const idVar = (id: string) => vlift(idOf(id));


/**
 * Convert short-hand `ParameterDescriptor` to `Parameter`.
 */
const fromDescriptor = (descriptor: ParameterDescriptor): Parameter => {
  if (typeof descriptor === 'string') {
    descriptor = [descriptor];
  }
  return {
    id: idVar(descriptor[0]),
    type: (descriptor[1] || Type.Any),
    modifier: (descriptor[2] || Modifier.Required)
  };
};


const signatureFailureMessage = {
  Required: 'Required parameters must preceed optional and rest parameters.',
  Optional: 'Optional parameters must preceed rest parameters.',
  Rest: 'A function signature must not contain more than one rest parameter.',
  BadForm: 'Invalid argument list form ',
  MisplacedKey: 'Identifier must follow modifier key.',
  UnknownKey: 'Unknown keyword '
};


/**
 * Create `Signature` from `Parameter` array.
 */
export const signatureOf = (parameters: Parameter[]): EvalResult<Signature> => {
  let minArity = 0;
  let maxArity = 0;
  let hasOptional = false;
  let hasRest = false;
  for (const parameter of parameters) {
    switch (parameter.modifier) {
      case Modifier.Required:
        if (hasOptional || hasRest) {
          return EvalFailure.of(signatureFailureMessage.Required);
        }
        minArity++;
        maxArity++;
      break;

      case Modifier.Optional:
        if (hasRest) {
          return EvalFailure.of(signatureFailureMessage.Optional);
        }
        hasOptional = true;
        maxArity++;
      break;
      
      case Modifier.Rest:
        if (hasRest) {
          return EvalFailure.of(signatureFailureMessage.Rest);
        }
        hasRest = true;
        maxArity = Infinity;
      break;
    }
  }
  return {parameters, minArity, maxArity};
};


export const partial = ({parameters}: Signature, n: number) => (
  signatureOf(parameters.slice(n))
);


const throwOnFailure = <T>(either: EvalResult<T>): T => {
  if (didEvalFail(either)) {
    throw new Error(either.message);
  }
  return either;
};


const fmap = <T, U>(fn: (x: T) => EvalResult<U>, list: T[]) => {
  const results: U[] = []
  for (const element of list) {
    const result = fn(element);
    if (didEvalFail(result)) {
      return result;
    }
    results.push(result);
  }
  return results;
}


/**
 * Create `Signature` from given *descriptors*.
 */
export const fromDescriptors = (...descriptors: ParameterDescriptor[]) => (
  throwOnFailure(signatureOf(throwOnFailure(fmap(fromDescriptor, descriptors))))
);


/**
 * Create `Signature` from Monalisp function definition.
 */
export const fromDefinition = (listVar: ListVar): EvalResult<Signature> => {
  const argumentList = listVar.expr;
  const parameters: Parameter[] = [];
  for (let i=0; i<argumentList.length; i++) {
    const argument = argumentList[i];
    // Required Parameter
    if (isIdentifier(argument)) {
      parameters.push({
        id: argument,
        type: Type.Any,
        modifier: Modifier.Required
      });
    }
    // Optional or Rest Parameter
    else if (isKeyword(argument)) {
      const {key} = argument.expr;
      const id = argumentList[++i];
      if (!id) {
        return EvalFailure.of(signatureFailureMessage.MisplacedKey);
      }
      if (key !== ':opt' && key !== ':rest') {
        return EvalFailure.of(signatureFailureMessage.UnknownKey + key);
      }
      if (isNotIdentifier(id)) {
        return EvalFailure.of(signatureFailureMessage.BadForm + id.expr);
      }
      parameters.push({
        id,
        type: Type.Any,
        modifier: (key === ':opt') ? Modifier.Optional : Modifier.Rest
      });
    }
    // Invalid Form
    else {
      return EvalFailure.of(signatureFailureMessage.BadForm + argument.expr);
    }
  }
  return signatureOf(parameters);
};


interface Verify {
  (signature: Signature, parameters: VarType[]): EvalResult<VarType[]>;
  (signature: Signature): (parameters: VarType[]) => EvalResult<VarType[]>;
}


/**
 * Returns `EvalFailure` if more parameters than the given *signature*'s maximum
 * arity are provided.
 */
export const verifyArity: Verify = curry(
  ({maxArity}: Signature, parameters: VarType[]) => {
    const length = parameters.length;
    if (length > maxArity) {
      return EvalFailure.of(
        `Too many parameters. Expected at most ${maxArity}, got ${length}`
      );
    }
    return parameters;
  }
);


/**
 * Verify that the types of the provided *parameters* match given *signature*.
 */
export const verifyTypes: Verify = curry(
  ({parameters}: Signature, argumentList: VarType[]): EvalResult<VarType[]> => {
    for (const [parameter, form] of zipLong(parameters, argumentList)) {
      if (isNotTypeMatch(parameter.type, form.type)) {
        const expected = typeName(parameter.type);
        const given = typeName(form.type);
        return EvalFailure.of(
          `Type Error. Expected ${expected}, got ${given}`
        );
      }
    }
    return argumentList;
  }
);


/**
 * Associate parameters of given `Signature` to a list of arguments.
 */
export const assocParams = ({parameters}: Signature, forms: VarType[]) => {
  const pairs: [IdentifierType, VarType][] = [];
  const min = Math.min(parameters.length, forms.length);
  for (let i=0; i<min; i++) {
    const param = parameters[i];
    switch (param.modifier) {
      case Modifier.Required:
      case Modifier.Optional:
        pairs.push([param.id.expr, forms[i]]); 
      break;
      case Modifier.Rest:
        pairs.push([param.id.expr, vlift(forms.slice(i))]);
      break;
    }
  }
  return pairs;
};
