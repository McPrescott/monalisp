// -----------------------------------------------------------------------------
// -- MONALISP GLOBAL SCOPE
//------------------------------------------------------------------------------


import {getIdentifier} from '../common/identifier';
import {Scope, ScopeStack} from './type/scope';
import * as math from './lib/math';


const globalScope = Scope.of();


/**
 * Define *form* as *name* in global scope.
 */
const def = (name: string, form: EvalForm) => (
  globalScope.define(getIdentifier(name), form)
);


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


export const global = ScopeStack.of([globalScope]);
