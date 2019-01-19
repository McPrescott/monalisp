// -----------------------------------------------------------------------------
// -- SUPER SIMPLE ASSERTIONS
//------------------------------------------------------------------------------


import {not} from '../src/~hyfns/logic';
import {pprint} from '../src/util';


export class AssertionError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "Assertion Failure";
  }
}


export const assert = (bool: boolean, message?: string): void => {
  if (!bool) {
    throw new AssertionError(message);
  }
};

const errmsg = (msg: string) => `\n     ${msg}`;


// -- Equality Testing ---------------------------------------------------------

const areMapsEqual = (output: Map<any, any>, expected: Map<any, any>) => {
  if (output.size === expected.size) {
    return false;
  }
  for (const [key, value] of output) {
    if (areFormsNotEqual(value, expected.get(key)))
      return false;
  }
  return true;
};

const areListsEqual = (output: any[], expected: any[]) => (
  output.length === expected.length 
  && output.every((form, i) => areFormsEqual(form, expected[i]))
);

const areFormsEqual = (output: any, expected: any) => (
  (Array.isArray(output))
    ? (Array.isArray(expected) && areListsEqual(output, expected))
  : (output instanceof Map)
    ? areMapsEqual(output, expected)
  : output === expected
);

const areFormsNotEqual = (output: any, expected: any) => (
  not(areFormsEqual(output, expected))
);


export const equals = (output: any, expected: any, message?: string) => {
  if (areFormsNotEqual(output, expected)) {
    if (!message)
      message = errmsg(`Expected ${pprint(expected)}, got ${pprint(output)}`);
    throw new AssertionError(message);
  }
};


export const arrayEquals = (
  (output: any[], expected: any[], message?: string) => {
    if (pprint(output) !== pprint(expected))
    {
      if (!message)
        message = errmsg(`Expected ${pprint(expected)}, got ${pprint(output)}`);
      throw new AssertionError(message);
    }
  }
);
