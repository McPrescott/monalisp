import {curry} from './curry';


/**
 * Apply *fn* to each element in *iterable*.
 */
export const map: Map = curry(
  <A, B>(fn: (elem: A) => B, iterable: Iterable<A>): B[] => {
    const result = [];
    for (const element of iterable) {
      result.push(fn(element));
    }
    return result;
  }
);

interface Map {
  <A, B>(fn: (elem: A) => B, iterable: Iterable<A>): B[]
  <A, B>(fn: (elem: A) => B): (iterable: Iterable<A>) => B[];
}