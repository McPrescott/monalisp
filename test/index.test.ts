import {describe, it} from 'mocha';
import {assert} from './assert';


describe('true', () => {
  it('should be true', () => {
    assert(true, 'true should be true');
  });
});
