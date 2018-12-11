import {describe, it} from 'mocha';
import {assert, equals} from './assert';
import {read, evaluate, execute} from '../src/main';


const execEquals = (input: string, expect: any) => {
  const result = execute(input);
  equals(result, expect, `${input} !== ${expect}, got ${result}`);
}


describe('Monalisp', () => {
  describe('Static Numbers', () => {
    it('should return same numerical value', () => {
      const input = '5';
      const expect = 5;
      const output = execute(input);
      equals(output, expect);
    });
  });

  describe('Identifier Definition', () => {
    it('should return the value bound to the given identifier', () => {
      const input = '(def id 123) id';
      const expect = 123;
      execEquals(input, expect);
    })
  });

  describe('Addition Function', () => {
    it('should return the sum of the values provided', () => {
      const input = '(def x 2) (+ x 3 4 5)'
      const expect = 14;
      execEquals(input, expect);
    })
  });

  describe('Subtraction Function', () => {
    it('should return the difference of the values provided', () => {
      const input = '(def x 30)(def y 8)(- x y)';
      const expect = 22;
      execEquals(input, expect);
    })
  });
});
