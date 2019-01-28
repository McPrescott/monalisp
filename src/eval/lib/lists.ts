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

export const nth = accessor(({form: n}, {form: list}) => list[n] || nil)

export const len = unary(({form: list}) => vlift(list.length));

export const cons = binary((head, {form: tail}) => vlift([head, ...tail]));

export const push = binary((last, {form: list}) => vlift([...list, last]));

export const pop = unary(list => vlift(list.form.slice(0, -1)));

export const head = unary(({form: expr}) => 
  (expr.length) ? expr[0] : nil
);

export const last = unary(({form: expr}) => 
  (expr.length) ? expr[expr.length-1] : nil
);

export const tail = unary(({form: list}) => vlift(list.slice(1)));

export const clone = unary(({form: list}) => vlift([...list]));

export const slice = slicing(({form: start}, {form: end}, {form: list}) => 
  vlift(list.slice(start, end))
);

export const take = accessor(({form: n}, {form: ls}) => vlift(ls.slice(0, n)));

export const takeLast = accessor(({form: n}, {form: ls}) => 
  vlift(ls.slice(-n))
);

export const concat = variadic((head, ...tail) => (
  (head) 
    ? vlift(head.form.concat(...tail.map(list => list.form))) 
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

export const reverse = unary(({form: list}) => vlift(list.reverse()));

export const map = applicative((env, {form: fn, src}, {form: list}) => {
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

export const fold = applicative((env, {form: fn, src}, {form: list}) => {
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

export const filter = applicative((env, {form: fn, src}, {form: list}) => {
  const filtered: VarType[] = [];
  let result: EvalResult;
  for (const form of list) {
    result = fn.call(env, variable([form], src));
    if (didEvalFail(result)) {
      return result;
    }
    if (result.form) {
      filtered.push(form);
    }
  }
  return vlift(filtered);
});

export const flatten = unary(({form: list}) => {
  const flatlist = [];
  for (const form of list) {
    isList(form)?
      flatlist.push(...form.form):
      flatlist.push(form);
  }
  return vlift(flatlist);
});

export const flatmap = applicative((env, {form: fn, src}, {form: list}) => {
  const results: VarType[] = [];
  for (const element of list) {
    const current = fn.call(env, variable([element], src));
    if (didEvalFail(current)) {
      return current;
    }
    isList(current)?
      results.push(...current.form):
      results.push(current);
  }
  return vlift(results);
});

export const has = binary(({form: form}, {form: list}) => (
  vlift(list.some(({form: element}) => form === element))
));

export const all = applicative((env, {form: fn, src}, {form: list}) => {
  let result: EvalResult;
  for (const form of list) {
    result = fn.call(env, variable([form], src));
    if (didEvalFail(result)) {
      return result;
    }
    if (not(result.form)) {
      return vlift(false);
    }
  }
  return vlift(true);
});

export const any = applicative((env, {form: fn, src}, {form: list}) => {
  let result: EvalResult;
  for (const form of list) {
    result = fn.call(env, variable([form], src));
    if (didEvalFail(result)) {
      return result;
    }
    if (result.form) {
      return vlift(true);
    }
  }
  return vlift(false);
});
