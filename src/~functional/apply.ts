import {curry} from './curry';

/**
 * Apply *argument* to *applicative*.
 */
export const apply = curry((argument, applicative: Applicative) => (
  applicative.apply(argument)
));

interface Applicative {
  apply(argument): any;
}
