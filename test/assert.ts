// -----------------------------------------------------------------------------
// -- SUPER SIMPLE ASSERTIONS
//------------------------------------------------------------------------------


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


export const equals = (output: any, expected: any, message?: string) => {
  if (output !== expected) {
    (message || (message = `Expected ${expected}, got ${output}`));
    throw new AssertionError(message);
  }
};