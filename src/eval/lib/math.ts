// -----------------------------------------------------------------------------
// -- BUILTIN MATH LIBRARY
//------------------------------------------------------------------------------


import {FormFlag} from '../../common/form-flag';
import {vlift, withForms} from '../../common/variable';
import {BuiltinProcedure as Builtin} from '../type/functions/builtin';


import {fromDescriptors, Modifier} from '../type/functions/common-signature';


// -- Constants ----------------------------------------------------------------

export const PI = Math.PI;
export const TAU = 2*Math.PI;
export const E = Math.E;
export const PHI = (1 + Math.sqrt(5)) / 2;
export const EPSILON = (Number.EPSILON || 2.220446049250313e-16);
export const INFINITY = Number.POSITIVE_INFINITY;
export const NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;


// -- Functions ----------------------------------------------------------------

const {Rest} = Modifier;

const variadicSignature = fromDescriptors(['numbers', FormFlag.Number, Rest]);
const nullarySignature = fromDescriptors();
const unarySignature = fromDescriptors(['x', FormFlag.Number]);
const binarySignature = fromDescriptors(
  ['x1', FormFlag.Number], ['x2', FormFlag.Number]
);

const nullary = (fn: () => FormType) => (
  Builtin.of(nullarySignature, (_) => vlift(fn()))
);

const unary = (fn: (x: number) => FormType) => (
  Builtin.of(unarySignature, (_, vx) => vlift(fn(vx.expr as number)))
);

const binary = (fn: (x: number, y: number) => FormType) => (
  Builtin.of(binarySignature, (_, vx, vy) => 
    vlift(fn(vx.expr as number, vy.expr as number))
  )
);

const variadic = (fn: (...n: number[]) => FormType) => (
  Builtin.of(variadicSignature, (_, ...vars) => vlift(withForms(fn)(...vars)))
);


// -- Basic Maths --------------------------------------------------------------

export const eq = binary((x, y) => x === y);

export const neq = binary((x, y) => x !== y);

export const add = variadic((sum=0, ...numbers) => 
  numbers.reduce((sum, n) => sum + n, sum)
);

export const subtract = variadic((difference=0, ...numbers) => 
  numbers.reduce((difference, n) => difference - n, difference)
);

export const multiply = variadic((product=1, ...numbers) => 
  numbers.reduce((product, n) => product * n, product)
);

export const divide = variadic((quotient=1, ...numbers) => 
  numbers.reduce((quotient, n) => quotient / n, quotient)
);

export const modulo = binary((x, y) => x % y);
export const abs = unary(Math.abs);
export const round = unary(Math.round);
export const floor = unary(Math.floor);
export const ceil = unary(Math.ceil);
export const sqrt = unary(Math.sqrt);
export const pow = binary(Math.pow);
export const random = nullary(Math.random);


// Trigonometry
export const cos = unary(Math.cos);
export const cosh = unary(Math.cosh);
export const acos = unary(Math.acos);
export const acosh = unary(Math.acosh);
export const sin = unary(Math.sin);
export const sinh = unary(Math.sinh);
export const asin = unary(Math.asin);
export const asinh = unary(Math.asinh);
export const tan = unary(Math.tan);
export const tanh = unary(Math.tanh);
export const atan = unary(Math.atan);
export const atanh = unary(Math.atanh);
export const atan2 = binary(Math.atan2)
