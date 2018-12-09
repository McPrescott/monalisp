// -----------------------------------------------------------------------------
// -- GLOBAL TYPE DEFINITIONS
//------------------------------------------------------------------------------


// -- Builtin Extensions -------------------------------------------------------

interface NumberConstructor {
  empty(): number;
}


interface StringConstructor {
  empty(): string;
}


interface ArrayConstructor {
  empty(): any[];
}


// -- Convenience Function Types -----------------------------------------------

type AnyFn = (...args: any[]) => any;

type Unary<T=any, R=T> = (arg: T) => R;

type Binary<T0=any, T1=T0, R=T0> = (...args: [T0, T1]) => R;

type Ternary<T0=any, T1=T0, T2=T0, R=T0> = (...args: [T0, T1, T2]) => R;

type UnaryPred<T> = (arg: T) => boolean;

type GenericPred = <T extends any[]>(...args: T) => boolean;

type ArgsOf<T extends AnyFn> = (
  T extends ((...x: infer A) => any) ? A : never
);

type ReturnOf<T extends AnyFn> = (
  T extends ((...x: any[]) => (infer R)) ? R : never
);
