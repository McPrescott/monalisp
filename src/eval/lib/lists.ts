// -----------------------------------------------------------------------------
// -- STANDARD LIST OPERATIONS
//------------------------------------------------------------------------------


import {not} from '../../~hyfns/logic';
import {map as realmap} from '../../~hyfns/map';
import {FormFlag as Type} from '../../common/form-flag';
import {variable, vlift, nil, withForms} from '../../common/variable';
import {isList} from '../../common/variable-type-guards';
import {didEvalFail} from '../eval-failure';
import {BuiltinProcedure as Builtin} from '../type/functions/builtin';

// import {Signature, ParameterKind as Kind} from '../type/functions/signature';
import {fromDescriptors, Modifier} from '../type/functions/common-signature';


// -- Signatures ---------------------------------------------------------------


const {Rest} = Modifier;

const listParam: [string, number] = ['list', Type.List];

const factorySignature = fromDescriptors(['elements', Type.Any, Rest]);
const accessorSignature = fromDescriptors(['index', Type.Number], listParam);
const unarySignature = fromDescriptors(listParam);
const binarySignature = fromDescriptors('form', listParam);
const variadicSignature = fromDescriptors(['lists', Type.List, Rest]);
const applicativeSignature = fromDescriptors(['fn', Type.Callable], listParam);
const sliceSignature = fromDescriptors(
  ['start', Type.Number], ['end', Type.Number], listParam
);



// -- Builtin Definition Helpers -----------------------------------------------


const factory = (fn: (...elements: VarType[]) => EvalResult) => (
  Builtin.of(factorySignature, (_, ...elements) => fn(...elements))
)

const accessor = (fn: (n: NumberVar, list: ListVar) => EvalResult) => (
  Builtin.of(accessorSignature, (_, n: NumberVar, list: ListVar) => fn(n, list))
);

const unary = (fn: (list: ListVar) => EvalResult) => (
  Builtin.of(unarySignature, (_, list: ListVar) => fn(list))
);

const binary = (fn: (form: VarType, list: ListVar) => EvalResult) => (
  Builtin.of(binarySignature, (_, form, list: ListVar) => fn(form, list))
);

const variadic = (fn: (...lists: ListVar[]) => EvalResult) => (
  Builtin.of(variadicSignature, (_, ...lists: ListVar[]) => fn(...lists))
);

const applicative = (
  (fn: (env: ScopeStackType, fn: CallableVar, list: ListVar) => EvalResult) => (
    Builtin.of(applicativeSignature, fn)
  )
);

const slicing = (
  (fn: (start: NumberVar, end: NumberVar, list: ListVar) => EvalResult) => (
    Builtin.of(sliceSignature, 
      (_, start: NumberVar, end: NumberVar, list: ListVar) => (
        fn(start, end, list)
      )
    )
  )
);



// -- Builtin List Procedures --------------------------------------------------


export const list = factory((...elements) => vlift(elements));

export const nth = accessor(({expr: n}, {expr: list}) => list[n] || nil)

export const len = unary(({expr: list}) => vlift(list.length));

export const cons = binary((head, {expr: tail}) => vlift([head, ...tail]));

export const push = binary((last, {expr: list}) => vlift([...list, last]));

export const pop = unary(list => vlift(list.expr.slice(0, -1)));

export const head = unary(({expr}) => 
  (expr.length) ? expr[0] : nil
);

export const last = unary(({expr}) => 
  (expr.length) ? expr[expr.length-1] : nil
);

export const tail = unary(({expr: list}) => vlift(list.slice(1)));

export const clone = unary(({expr: list}) => vlift([...list]));

export const slice = slicing(({expr: start}, {expr: end}, {expr: list}) => 
  vlift(list.slice(start, end))
);

export const take = accessor(({expr: n}, {expr: ls}) => vlift(ls.slice(0, n)));

export const takeLast = accessor(({expr: n}, {expr: ls}) => 
  vlift(ls.slice(-n))
);

export const concat = variadic((head, ...tail) => (
  (head) 
    ? vlift(head.expr.concat(...tail.map(list => list.expr))) 
    : nil
));

export const zip = variadic(withForms((...lists: ListType[]) => {
  const zipped: VarType[] = [];
  let minLength = Math.min(...realmap(list => list.length, lists));
  for (let i=0; i<minLength; i++) {
    zipped.push(vlift(realmap(ls => ls[i], lists)));
  }
  return vlift(zipped);
}));

export const reverse = unary(({expr: list}) => vlift(list.reverse()));

export const map = applicative((env, {expr: fn, src}, {expr: list}) => {
  const results: VarType[] = [];
  for (const element of list) {
    const current = fn.call(env, variable([element], src));
    if (didEvalFail(current)) {
      return current;
    }
    results.push(current);
  }
  return vlift(results);
});

export const fold = applicative((env, {expr: fn, src}, {expr: list}) => {
  if (list.length < 2) {
    return list[0] || nil;
  }

  let accum = fn.call(env, variable(list.slice(0, 2), src));
  if (didEvalFail(accum)) {
    return accum;
  }
  for (const current of list.slice(2)) {
    accum = fn.call(env, variable([accum, current], src));
    if (didEvalFail(accum)) {
      return accum;
    }
  }
  return accum;
});

export const filter = applicative((env, {expr: fn, src}, {expr: list}) => {
  const filtered: VarType[] = [];
  let result: EvalResult;
  for (const form of list) {
    result = fn.call(env, variable([form], src));
    if (didEvalFail(result)) {
      return result;
    }
    if (result.expr) {
      filtered.push(form);
    }
  }
  return vlift(filtered);
});

export const flatten = unary(({expr: list}) => {
  const flatlist = [];
  for (const form of list) {
    isList(form)?
      flatlist.push(...form.expr):
      flatlist.push(form);
  }
  return vlift(flatlist);
});

export const flatmap = applicative((env, {expr: fn, src}, {expr: list}) => {
  const results: VarType[] = [];
  for (const element of list) {
    const current = fn.call(env, variable([element], src));
    if (didEvalFail(current)) {
      return current;
    }
    isList(current)?
      results.push(...current.expr):
      results.push(current);
  }
  return vlift(results);
});

export const has = binary(({expr: form}, {expr: list}) => (
  vlift(list.some(({expr: element}) => form === element))
));

export const all = applicative((env, {expr: fn, src}, {expr: list}) => {
  let result: EvalResult;
  for (const form of list) {
    result = fn.call(env, variable([form], src));
    if (didEvalFail(result)) {
      return result;
    }
    if (not(result.expr)) {
      return vlift(false);
    }
  }
  return vlift(true);
});

export const any = applicative((env, {expr: fn, src}, {expr: list}) => {
  let result: EvalResult;
  for (const form of list) {
    result = fn.call(env, variable([form], src));
    if (didEvalFail(result)) {
      return result;
    }
    if (result.expr) {
      return vlift(true);
    }
  }
  return vlift(false);
});
