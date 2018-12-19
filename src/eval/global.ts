// -----------------------------------------------------------------------------
// -- MONALISP GLOBAL SCOPE
//------------------------------------------------------------------------------


import {getIdentifier} from '../common/identifier';
import {Scope, ScopeStack} from './scope';
import {add, subtract, multiply, divide} from './builtin/math';


const global = Scope.of();

global.define(getIdentifier('+') as IdentifierType, add);
global.define(getIdentifier('-') as IdentifierType, subtract);
global.define(getIdentifier('*') as IdentifierType, multiply);
global.define(getIdentifier('/') as IdentifierType, divide);


/**
 * Global scope, includes builtins of `Procedure`, `SpecialForm` and other
 * `EvalForm` types.
 */
export const globalScope = ScopeStack.of([global]);
