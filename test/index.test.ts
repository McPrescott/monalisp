import {describe, it} from 'mocha';
import {assert, equals} from './assert';
import {read, evaluate, execute} from '../src/main';


describe('Monalisp', () => {
  describe('Static Numbers', () => {
    it('should return same numerical value', () => {
      const input = '5';
      const output = execute(input);
      const expected = 5;
      equals(output, expected);
    });
  })
});
