import {describe, it} from 'mocha';
import {arrayEquals, equals} from './assert';
import {map} from '../src/~hyfns/map';
import {didParseFail} from '../src/read/parse/parser';
import {read, evaluate, execute} from '../src/main';
import {didEvalFail} from '../src/eval/eval-failure';
import {getIdentifier as idOf} from '../src/common/identifier';
import {pprint} from '../src/util';



const execIt = (source: string, expect: any) => {
  it(`Exec: ${source} = ${expect}`, () => {
    const result = execute(source);
    if (didEvalFail(result))
      throw new EvalError(result.toString());
    equals(result, expect, `Got: ${result}`);
  });
};


const readIt = (source: string, expect: any) => {
  it(`Read: ${source} = ${pprint(expect)}`, () => {
    const result = read(source);
    if (didParseFail(result))
      throw new SyntaxError(result.toString());
    //@ts-ignore
    arrayEquals(map(e => e.expression, result), expect);
  });
};


const describeRead = (title: string, source: string, expect: any) => {
  describe(title, () => {
    readIt(source, expect);
  });
};


const describeExec = (title: string, source: string, expect: any) => {
  describe(title, () => {
    execIt(source, expect);
  });
};


describe('Monalisp', () => {

  describeRead('Read number', 
    '5', [5]
  );

  describeExec('Exec number',
    '5', 5
  );

  describeRead('Read list',
    '(+ 10 20)', [[idOf('+'), 10, 20]]
  );

  describeExec('Addition function',
    '(+ 10 20)', 30
  );

  describeExec('Subtraction function',
    '(- 100 33)', 67
  );

  describeExec('Multiplication function',
    '(* 8 8)', 64
  );

  describeExec('Division function',
    '(/ 9 3)', 3
  );

  // describeExec('Identifier Definition',
  //   '(def id 123) id', 123
  // );

  // describeExec('Addition Function',
  //   '(def x 2) (+ x 3 4 5)', 14
  // );

  // describeExec('Subtraction Function',
  //   '(def x 30)(def y 8)(- x y)', 22
  // );

  // describeExec('Multiplication Function',
  //   '(def a 3)(def b 5)(* a b)', 15
  // );

  // describeExec('Division Function',
  //   '(def t 100)(def b 2)(/ t b)', 50
  // );

  // describeExec('Nested Addition & Subtration',
  //   '(+ (+ 4 2 5) 8 (- 18 10))', 27
  // );
});
