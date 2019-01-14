// -----------------------------------------------------------------------------
// -- STANDARD LIST OPERATIONS
//------------------------------------------------------------------------------


import {FormFlag as Type} from '../../common/form-flag';
import {withForms} from '../../common/variable';
import {Signature, ParameterKind as Kind} from '../type/signature';
import {BuiltinProcedure as Builtin} from '../type/functions/builtin';


/**
 * Get element at *index* from *list*.
 */
export const get = Builtin.of(
  Signature.of(['index', Type.Number], ['list', Type.List]),
  withForms((index: number, list: ListType) => {
    const max = list.length - 1;
    return (index >= 0 && index <= max) ? list[index] : null;
  })
);


/**
 * Return length of given *list*.
 */
export const len = Builtin.of(
  Signature.of(['list', Type.List]),
  withForms((list: ListType) => list.length)
);


/**
 * Concatenate any number of lists.
 */
export const concat = Builtin.of(
  Signature.of(['lists', Type.List, Kind.Rest]),
  (head: ListType, ...tail: ListType[]) => (
    (head) ? head.concat(...tail) : null
  )
);


export const map = Builtin.of(
  Signature.of(['list', Type.List], ['fn', Type.Callable]),
  withForms((list: ListType, fn: CallableType) => (
    list.map(expr => fn.call(expr))
  ))
)
