/**
 * Generic base `Success` class. Can be useful in cases in which multiple
 * derrived `Success` classes may be present.
 */
export class Success<T> {
  constructor(public value: T) {}
};