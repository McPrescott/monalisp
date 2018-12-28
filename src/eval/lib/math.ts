// -----------------------------------------------------------------------------
// -- BUILTIN MATH PROCEDURES
//------------------------------------------------------------------------------


import {FormFlag} from '../../common/form-flag';
import {BuiltinProcedure as Builtin, Signature} from '../type/builtin';


const numberListSignature = Signature.of([['numbers', FormFlag.Number]], true);
const nullarySignature = Signature.of([]);
const unarySignature = Signature.of([['x', FormFlag.Number]]);
const binarySignature = Signature.of([
  ['x', FormFlag.Number], ['y', FormFlag.Number]
]);


const nullary = (fn: () => number) => (
  Builtin.of(nullarySignature, fn)
);


/**
 * Create unary builtin math function.
 */
const unary = (fn: (x: number) => number) => (
  Builtin.of(unarySignature, fn)
);


/**
 * Create binary builtin math function.
 */
const binary = (fn: (x: number, y: number) => number) => (
  Builtin.of(binarySignature, fn)
);


/**
 * Builtin addition procedure.
 */
export const add = Builtin.of(
  numberListSignature,
  (sum: number = 0, ...numbers: number[]) => {
    for (const n of numbers)
      sum += n;
    return sum;
  }
);


/**
 * Builtin subtraction function.
 */
export const subtract = Builtin.of(
  numberListSignature,
  (difference: number = 0, ...numbers: number[]) => {
    for (const n of numbers)
      difference -= n;
    return difference;
  }
);


/**
 * Builtin multiplication function.
 */
export const multiply = Builtin.of(
  numberListSignature,
  (product: number = 1, ...numbers: number[]) => {
    for (const n of numbers)
      product *= n;
    return product;
  }
);


/**
 * Builtin division function.
 */
export const divide = Builtin.of(
  numberListSignature,
  (quotient: number = 1, ...numbers: number[]) => {
    for (const n of numbers)
      quotient /= n;
    return quotient;
  }
);


/**
 * Builtin modulo function.
 */
export const modulo = Builtin.of(
  Signature.of([['dividend', FormFlag.Number], ['divisor', FormFlag.Number]]),
  (dividend: number, divisor: number) => (
    dividend % divisor
  )
);


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
export const atan2 = Builtin.of(
  Signature.of([['y', FormFlag.Number], ['x', FormFlag.Number]]),
  Math.atan2
);
