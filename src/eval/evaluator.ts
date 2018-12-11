// -----------------------------------------------------------------------------
// -- MONALISP EVALUATOR
//------------------------------------------------------------------------------


import {Identifier} from '../builtin/identifier';
import {IDTable} from './id-table';
import {head, tail} from '../util';
import {map, curry} from '../~hyfns';


type SpecialForm = (scope: IDTable, ...expressions: SExpr[]) => any;


const specialForm: {[key: string]: SpecialForm} = Object.create(null);

specialForm['def'] = (scope: IDTable, id: SExpr, value: SExpr, ...r) => {
  if (r.length) {
    const n = r.length + 2;
    throw new EvalError(`Too many arguments to "def", expected 2 got ${n}`);
  }
  else if (!(id instanceof Identifier)) {
    throw new EvalError(`First argument of "def" must be an ID, got ${id}`);
  }
  return scope.register(id, evaluateExpr(scope, value));
};


const builtin: {[key: string]: Function} = Object.create(null);

builtin['+'] = (scope: IDTable, ...args: any) => {
  let sum = 0;
  for (const n of args) {
    sum += n;
  }
  return sum;
};

builtin['-'] = (scope: IDTable, ...args: any[]) => {
  let difference = head(args);
  for (const n of tail(args))
    //@ts-ignore
    difference -= n;
  return difference;
};

builtin['*'] = (scope: IDTable, ...args: any[]) => {
  let product = 1;
  for (const n of args)
    product *= n;
  return product;
}

builtin['/'] = (scope: IDTable, ...args: any[]) => {
  let quotient = head(args);
  for (const n of tail(args))
    quotient /= n;
  return quotient;
}


const invokeExpression = (scope: IDTable, exprs: SExpr[]) => {
  const fnId = head(exprs);
  if (fnId instanceof Identifier) {
    if (fnId.name in specialForm) {
      return specialForm[fnId.name](scope, ...tail(exprs));
    }
    else {
      const fn = builtin[fnId.name] || scope.resolve(fnId);
      if (fn instanceof Function) {
        return fn(scope, ...map(evaluateExpr(scope), tail(exprs)));
      }
      throw new EvalError(`${fnId.name} is ${fn}`);
    }
  }
  throw new EvalError(`Cannot invoke ${fnId}`);
}


const evaluateExpr = curry((scope: IDTable, expr: SExpr): any => {
  if (expr instanceof Identifier) {
    return scope.resolve(expr);
  }
  else if (Array.isArray(expr)) {
    return invokeExpression(scope, expr);
  }
  else if (expr instanceof Map) {

  }
  return expr;
})


export const evaluate = (sexprs: SExpr[], scope=IDTable.create()): any => {
  let current;
  for (const expr of sexprs) {
    current = evaluateExpr(scope, expr);
  }
  return current;
}

