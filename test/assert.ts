// -----------------------------------------------------------------------------
// -- SUPER SIMPLE ASSERTIONS
//------------------------------------------------------------------------------


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


export const equals = (output: any, expected: any, message?: string) => {
  if (output !== expected) {
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