import {describe, it} from 'mocha';
import {assert, equals, arrayEquals} from './assert';
import {map} from '../src/~hyfns/map';
import {Identifier} from '../src/common/identifier';
import {didParseFail} from '../src/read/parse/parser';
import {read, evaluate, execute} from '../src/main';
import {didEvalFail} from '../src/eval/eval-failure';
import {pprintValues} from '../src/util';


const extractForm = ({expr}: any) => (
  (Array.isArray(expr)) ? expr.map(extractForm)
  : (expr instanceof Map) ? extractFormFromMap(expr)
  : expr
);


const extractFormFromMap = (form: Map<any, any>) => {
  const map = new Map();
  for (const [key, value] of form) {
    map.set(key, value);
  }
  return map;
}


const execIt = (source: string, expect: any) => {
  it(`${source} = ${pprintValues(expect)}`, () => {
    const result = execute(source);
    if (didEvalFail(result)) {
      throw new EvalError(result.toString());
    }

    const form = extractForm(result);
    if (expect instanceof Function) {
      assert(expect(form), `${form} failed assertion`);
    }
    else {
      equals(form, expect, `${pprintValues(form)} != ${pprintValues(expect)}`);
    }
  });
};


const readIt = (source: string, expect: any) => {
  it(`${source} = ${pprintValues(expect)}`, () => {
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


  // -- Math Library -----------------------------------------------------------

  describeExec('Exec number',
    '5', 5
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

  describeExec('Random function', 
    '(random)', (x: any) => (typeof x === 'number' && 0 < x && x < 1)
  );

  describeExec('Numeric Constants',
    '(+ π φ τ E ε)', Math.PI*3 + ((1+Math.sqrt(5))/2) + Math.E + Number.EPSILON
  );


  // -- Special Forms ----------------------------------------------------------

  describeExec('Variable definition',
    '(def x (+ 20 25 30)) x', 75
  );

  describeExec('Procedure definition', 
    '(def add-10 (fn (y) (+ 10 y))) (add-10 30)', 40
  );

  describeExec('Conditionals',
    '(if true (def x 5) (def x -100)) \
    (if nil (def y 100) (def y 5)) \
    (+ x y)', 10
  );

  describeExec('The quote special form',
    '(quote id)', (form: any) => (
      form instanceof Identifier && form.name === 'id'
    )
  );

  describeExec('The and/or special forms',
    '(* (and 1 2 3 4) (or 0 false nil 2 100))', 8
  );


  // -- List Primitives --------------------------------------------------------

  describeExec('nth',
    `(nth 2 '(1 2 3 4))`, 3
  );

  describeExec('len',
    `(len '(1 2 3))`, 3
  );

  describeExec('cons',
    "(cons 5 '())", [5]
  );

  describeExec('head',
    "(head '(10 18 1 49))", 10
  );

  describeExec('tail',
    "(tail '(0 1 2 3 4 5))", [1, 2, 3, 4, 5]
  );

  describeExec('last',
    "(last '(10 20 30 40))", 40
  );

  describeExec('take',
    `(take 2 '(1 2 3 4 5))`, [1, 2]
  );

  describeExec('takeLast',
    `(takeLast 3 '(0 1 2 3 4))`, [2, 3, 4]
  );

  describeExec('clone',
    `(clone '(1 2 3))`, [1, 2, 3]
  );

  describeExec('slice',
    `(slice 1 4 '(1 2 3 4 5 6))`, [2, 3, 4]
  );

  describeExec('push',
    "(push 10 '(5))", [5, 10]
  );

  describeExec('pop',
    `(pop '(2 4 6 8 10))`, [2, 4, 6, 8]
  );

  describeExec('concat',
    `(concat '(1 2 3) '(4) '(5 6))`, [1, 2, 3, 4, 5, 6]
  );

  describeExec('map',
    `(map (fn (x) (+ 1 x)) '(1 2 3 4 5))`, [2, 3, 4, 5, 6]
  );

  describeExec('fold',
    `(fold (fn (sum x) (+ sum x)) '(2 4 6 8 10))`, 30
  );

  describeExec('filter',
    `(filter (fn (x) (= (% x 2) 0)) '(1 2 3 4 5))`, [2, 4]
  );

  describeExec('flatten',
    `(flatten '(1 2 (3 4) (5) 6 7))`, [1, 2, 3, 4, 5, 6, 7]
  );

  describeExec('flatmap',
    `(flatmap (fn (x) (ls x (+ x 1))) '(1 3))`, [1, 2, 3, 4]
  );

  describeExec('zip',
    `(zip '(1 3 5) '(2 4 6))`, [[1, 2], [3, 4], [5, 6]]
  );

  describeExec('reverse',
    `(reverse '(1 2 3 4 5))`, [5, 4, 3, 2, 1]
  );

  describeExec('has?',
    `(has? 2 '(1 2 3 4))`, true
  );

  describeExec('all?',
    `(all? (fn (x) (/= x 2)) '(1 2 3 4))`, false
  );

  describeExec('any?',
    `(any? (fn (x) (= x 2)) '(1 2 3 4))`, true
  );
});
