export interface Pipe {

  <T, R0>(
    fn0: (arg: T) => R0,
  ): (arg: T) => R0;

  <T, R0, R1>(
    fn0: (arg: T) => R0,
    fn1: (arg: R0) => R1
  ): (arg: T) => R1;

  <T, R0, R1, R2>(
    fn0: (arg: T) => R0,
    fn1: (arg: R0) => R1,
    fn2: (arg: R1) => R2
  ): (arg: T) => R2;

  <T, R0, R1, R2, R3>(
    fn0: (arg: T) => R0,
    fn1: (arg: R0) => R1,
    fn2: (arg: R1) => R2,
    fn3: (arg: R2) => R3
  ): (arg: T) => R3;

  <T, R0, R1, R2, R3, R4>(
    fn0: (arg: T) => R0,
    fn1: (arg: R0) => R1,
    fn2: (arg: R1) => R2,
    fn3: (arg: R2) => R3,
    fn4: (arg: R3) => R4
  ): (arg: T) => R4;

  <T, R0, R1, R2, R3, R4, R5>(
    fn0: (arg: T) => R0,
    fn1: (arg: R0) => R1,
    fn2: (arg: R1) => R2,
    fn3: (arg: R2) => R3,
    fn4: (arg: R3) => R4,
    fn5: (arg: R4) => R5
  ): (arg: T) => R5;

  <T, R0, R1, R2, R3, R4, R5, R6>(
    fn0: (arg: T) => R0,
    fn1: (arg: R0) => R1,
    fn2: (arg: R1) => R2,
    fn3: (arg: R2) => R3,
    fn4: (arg: R3) => R4,
    fn5: (arg: R4) => R5,
    fn6: (arg: R5) => R6
  ): (arg: T) => R6;

  <T, R0, R1, R2, R3, R4, R5, R6, R7>(
    fn0: (arg: T) => R0,
    fn1: (arg: R0) => R1,
    fn2: (arg: R1) => R2,
    fn3: (arg: R2) => R3,
    fn4: (arg: R3) => R4,
    fn5: (arg: R4) => R5,
    fn6: (arg: R5) => R6,
    fn7: (arg: R6) => R7
  ): (arg: T) => R7;
}