import {describe, it} from 'mocha';
import {assert, equals} from './assert';
import {read, evaluate, execute} from '../src/main';



const execIt = (source: string, expect: any) => {
  it(`${source} = ${expect}`, () => {
    const result = execute(source);
    equals(result, expect, `Got: ${result}`);
  });
}


const describeIt = (title: string, source: string, expect: any) => {
  describe(title, () => {
    execIt(source, expect);
  });
};


describe('Monalisp', () => {
  describeIt('Static Number',
    '5', 5
  );

  describeIt('Identifier Definition',
    '(def id 123) id', 123
  );

  describeIt('Addition Function',
    '(def x 2) (+ x 3 4 5)', 14
  );

  describeIt('Subtraction Function',
    '(def x 30)(def y 8)(- x y)', 22
  );

  describeIt('Multiplication Function',
    '(def a 3)(def b 5)(* a b)', 15
  );

  describeIt('Division Function',
    '(def t 100)(def b 2)(/ t b)', 50
  );

  describeIt('Nested Addition & Subtration',
    '(+ (+ 4 2 5) 8 (- 18 10))', 27
  );
});
