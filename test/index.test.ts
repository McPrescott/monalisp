import {describe, it} from 'mocha';
import {assert, equals, arrayEquals} from './assert';
import {map} from '../src/~hyfns/map';
import {Identifier, getIdentifier as idOf} from '../src/common/identifier';
import {didParseFail} from '../src/read/parse/parser';
import {read, evaluate, execute} from '../src/main';
import {didEvalFail} from '../src/eval/eval-failure';
import {pprintValues} from '../src/util';



// -- Helpers ------------------------------------------------------------------


const extractForm = ({form}: any) => (
  (Array.isArray(form)) ? form.map(extractForm)
  : (form instanceof Map) ? extractFormFromMap(form)
  : form
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

const describeSet = (title: string, ...cases: any) => {
  describe(title, () => {
    for (let i=0; i<cases.length-1; i+=2) {
      execIt(cases[i], cases[i+1])
    }
  });
};



// -- Special Forms ------------------------------------------------------------


describe('Special Forms', () => {
  describeSet('def',
    `(def x 5) x`, 5,
    `(def x "string") x`, "string",
    `(def x 'id) x`, idOf('id')
  );
  
  describeSet('fn',
    `((fn (x) x) 40)`, 40,
    `((fn (x :opt y) x) 10)`, 10,
    `((fn (x :opt y) (+ x y)) 5 5)`, 10,
    `((fn (:rest x) x) 1 2 3 4 5)`, [1, 2, 3, 4, 5],
    `((fn (x y :rest z) z) 1 2)`, null,
    `(((fn (x y) (+ x y)) 1) 2)`, 3
  );
  
  describeExec('if',
    '(if true (def x 5) (def x -100)) \
    (if nil (def y 100) (def y 5)) \
    (+ x y)', 10
  );
  
  describeExec('quote',
    '(quote id)', (form: any) => (
      form instanceof Identifier && form.name === 'id'
    )
  );
  
  describeExec('and & or',
    '(* (and 1 2 3 4) (or 0 false nil 2 100))', 8
  );
});



// -- Logic and Predicate Library ----------------------------------------------

describe('Logic and Predicates', () => {
  
  describeSet('not', 
    `(not true)`, false,
    `(not false)`, true,
    `(not "truthy")`, false
  );

  describeSet('nil?',
    `(nil? nil)`, true,
    `(nil? false)`, false,
    `(nil? 100)`, false,
    `(nil? "string")`, false,
    `(nil? 'id)`, false,
    `(nil? :key)`, false,
    `(nil? '(1 2 3))`, false,
    `(nil? {:key "value"})`, false,
    `(nil? (fn (a) a))`, false
  );

  describeSet('bool?',
    `(bool? nil)`, false,
    `(bool? false)`, true,
    `(bool? 100)`, false,
    `(bool? "string")`, false,
    `(bool? 'id)`, false,
    `(bool? :key)`, false,
    `(bool? '(1 2 3))`, false,
    `(bool? {:key "value"})`, false,
    `(bool? (fn (a) a))`, false
  );

  describeSet('number?',
    `(number? nil)`, false,
    `(number? false)`, false,
    `(number? 100)`, true,
    `(number? "string")`, false,
    `(number? 'id)`, false,
    `(number? :key)`, false,
    `(number? '(1 2 3))`, false,
    `(number? {:key "value"})`, false,
    `(number? (fn (a) a))`, false
  );

  describeSet('string?',
    `(string? nil)`, false,
    `(string? false)`, false,
    `(string? 100)`, false,
    `(string? "string")`, true,
    `(string? 'id)`, false,
    `(string? :key)`, false,
    `(string? '(1 2 3))`, false,
    `(string? {:key "value"})`, false,
    `(string? (fn (a) a))`, false
  );

  describeSet('id?',
    `(id? nil)`, false,
    `(id? false)`, false,
    `(id? 100)`, false,
    `(id? "string")`, false,
    `(id? 'id)`, true,
    `(id? :key)`, false,
    `(id? '(1 2 3))`, false,
    `(id? {:key "value"})`, false,
    `(id? (fn (a) a))`, false
  );

  describeSet('key?',
    `(key? nil)`, false,
    `(key? false)`, false,
    `(key? 100)`, false,
    `(key? "string")`, false,
    `(key? 'id)`, false,
    `(key? :key)`, true,
    `(key? '(1 2 3))`, false,
    `(key? {:key "value"})`, false,
    `(key? (fn (a) a))`, false
  );

  describeSet('list?',
    `(list? nil)`, false,
    `(list? false)`, false,
    `(list? 100)`, false,
    `(list? "string")`, false,
    `(list? 'id)`, false,
    `(list? :key)`, false,
    `(list? '(1 2 3))`, true,
    `(list? {:key "value"})`, false,
    `(list? (fn (a) a))`, false
  );

  describeSet('map?',
    `(map? nil)`, false,
    `(map? false)`, false,
    `(map? 100)`, false,
    `(map? "string")`, false,
    `(map? 'id)`, false,
    `(map? :key)`, false,
    `(map? '(1 2 3))`, false,
    `(map? {:key "value"})`, true,
    `(map? (fn (a) a))`, false
  );

  describeSet('fn?',
    `(fn? nil)`, false,
    `(fn? false)`, false,
    `(fn? 100)`, false,
    `(fn? "string")`, false,
    `(fn? 'id)`, false,
    `(fn? :key)`, false,
    `(fn? '(1 2 3))`, false,
    `(fn? {:key "value"})`, false,
    `(fn? (fn (a) a))`, true
  );
});




// -- Math Library -------------------------------------------------------------


describe('Math', () => {

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
});



// -- List Library -------------------------------------------------------------


describe('Lists', () => {

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
    `(filter (fn (x) (= (mod x 2) 0)) '(1 2 3 4 5))`, [2, 4]
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



// -- Dictionary Library -------------------------------------------------------

