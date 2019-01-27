// -----------------------------------------------------------------------------
// -- MONALISP GLOBAL SCOPE
//------------------------------------------------------------------------------


import {getIdentifier} from '../common/identifier';
import {vlift} from '../common/variable';
import {Scope, ScopeStack} from './type/scope';
import * as specialForms from './lib/special-forms';
import * as logic from './lib/logic';
import * as math from './lib/math';
import * as list from './lib/lists';


const globalScope = Scope.of();


/**
 * Define *form* as *name* in global scope.
 */
const def = (name: string, form: FormType) => (
  globalScope.define(getIdentifier(name), vlift(form))
);



// -- Special Forms ------------------------------------------------------------


def('def', specialForms.def);
def('fn', specialForms.fn);
def('if', specialForms.if_);
def('quote', specialForms.quote);
def('and', specialForms.and);
def('or', specialForms.or);



// -- Logic and Predicates -----------------------------------------------------


def('not', logic.not)
def('nil?', logic.isNil);
def('bool?', logic.isBool);
def('number?', logic.isNumber);
def('string?', logic.isString);
def('id?', logic.isId);
def('key?', logic.isKey);
def('list?', logic.isList);
def('map?', logic.isDictionary);
def('fn?', logic.isFn);



// -- Builtin Maths ------------------------------------------------------------


// constants
def('PI', math.PI);
def('π', math.PI);
def('TAU', math.TAU);
def('τ', math.TAU);
def('E', math.E);
def('PHI', math.PHI);
def('φ', math.PHI);
def('EPSILON', math.EPSILON);
def('ε', math.EPSILON);
def('INF', math.INFINITY);
def('-INF', math.NEGATIVE_INFINITY);

// functions
def('=', math.eq);
def('eq', math.eq);
def('/=', math.neq);
def('neq', math.neq);
def('+', math.add);
def('-', math.subtract);
def('*', math.multiply);
def('/', math.divide);
def('mod', math.modulo);
def('sqrt', math.sqrt);
def('pow', math.pow);
def('abs', math.abs);
def('floor', math.floor);
def('round', math.round);
def('ceil', math.ceil);
def('random', math.random);
def('cos', math.cos);
def('cosh', math.cosh);
def('acos', math.acos);
def('acosh', math.acosh);
def('sin', math.sin);
def('sinh', math.sinh);
def('asin', math.asin);
def('asinh', math.asinh);
def('tan', math.tan);
def('tanh', math.tanh);
def('atan', math.atan);
def('atanh', math.atanh);
def('atan2', math.atan2);



// -- Builtin List Primitives --------------------------------------------------


def('ls', list.list);
def('nth', list.nth);
def('len', list.len);
def('cons', list.cons);
def('head', list.head);
def('tail', list.tail);
def('last', list.last);
def('take', list.take);
def('takeLast', list.takeLast);
def('clone', list.clone);
def('slice', list.slice);
def('push', list.push);
def('pop', list.pop);
def('concat', list.concat);
def('map', list.map);
def('fold', list.fold);
def('filter', list.filter);
def('flatten', list.flatten);
def('flatmap', list.flatmap);
def('zip', list.zip);
def('reverse', list.reverse);
def('has?', list.has);
def('all?', list.all);
def('any?', list.any);



export const global = ScopeStack.of([globalScope]);
