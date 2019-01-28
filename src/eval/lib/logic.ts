// -----------------------------------------------------------------------------
// -- MONALISP LOGIC AND PREDICATES LIBRARY
//------------------------------------------------------------------------------


import {FormFlag as Type} from '../../common/form-flag';
import {vlift, withForms} from '../../common/variable';
import {BuiltinProcedure as Builtin} from '../type/functions/builtin';
import * as v from '../../common/variable-type-guards';


// import {Signature, ParameterKind} from '../type/functions/signature';
import {fromDescriptors} from '../type/functions/common-signature';


// -- Signatures ---------------------------------------------------------------


const predicateSignature = fromDescriptors('form');
const higherOrderFnSignature = fromDescriptors(['fn', Type.Callable]);



// -- Builtin Definition Helpers -----------------------------------------------


const predicate = (fn: (form: VarType) => boolean) => (
  Builtin.of(predicateSignature, (_, form) => vlift(fn(form)))
);

type Env = ScopeStackType;

const higherOrderFn = (fn: (env: Env, form: CallableVar) => EvalResult) => (
  Builtin.of(higherOrderFnSignature, fn)
);


// -- Builtin Logic and Predicates ---------------------------------------------


export const not = predicate(({form: form}) => (!form));

// Type Predicates

export const isNil = predicate(v.isNil);
export const isBool = predicate(v.isBoolean);
export const isNumber = predicate(v.isNumber);
export const isString = predicate(v.isString);
export const isId = predicate(v.isIdentifier);
export const isKey = predicate(v.isKeyword);
export const isList = predicate(v.isList);
export const isDictionary = predicate(v.isDictionary);
export const isFn = predicate(v.isCallable);
