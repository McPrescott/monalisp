// -----------------------------------------------------------------------------
// -- SUPER SIMPLE ASSERTIONS
//------------------------------------------------------------------------------


export class AssertionError extends Error {
  constructor(message?: string) {
    super(message);
  }
}


export const assert = (bool: boolean, message?: string): void => {
  if (!bool) {
    throw new AssertionError(message);
  }
};
