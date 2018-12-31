// -----------------------------------------------------------------------------
// -- MONALISP GLOBAL SCOPE
//------------------------------------------------------------------------------


import {getIdentifier} from '../common/identifier';
import {Scope, ScopeStack} from './type/scope';
import * as specialForms from './lib/special-forms';
import * as math from './lib/math';


const globalScope = Scope.of();


/**
 * Define *form* as *name* in global scope.
 */
const def = (name: string, form: EvalForm) => (
  globalScope.define(getIdentifier(name), form)
);


// -- Define Special Forms -----------------------------------------------------

def('def', specialForms.def);
def('fn', specialForms.fn);
def('if', specialForms.if_);
def('quote', specialForms.quote);


// -- Define Builtin Math ------------------------------------------------------

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
def('+', math.add);
def('-', math.subtract);
def('*', math.multiply);
def('/', math.divide);
def('%', math.modulo);
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
def('atan2', math.atan2);
def('atan2', math.atan2);


export const global = ScopeStack.of([globalScope]);
