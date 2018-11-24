/**
 * Generic base `Failure` class. Can be useful in cases in which multiple
 * derrived `Failure` classes may be present.
 */
export default class Failure {
  constructor(public message: string) {}
};