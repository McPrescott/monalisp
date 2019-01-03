// -----------------------------------------------------------------------------
// -- STANDARD LIST OPERATIONS
//------------------------------------------------------------------------------


import {FormFlag as Type} from '../../common/form-flag';
import {Signature, ParameterKind as Kind} from '../type/signature';
import {BuiltinProcedure as Builtin} from '../type/builtin';
import {SpecialForm} from '../type/special-form';


/**
 * Get element at *index* from *list*.
 */
export const get = Builtin.of(
  Signature.of(['index', Type.Number], ['list', Type.List]),
  (index: number, list: ListType) => {
    const max = list.length - 1;
    return (index >= 0 && index <= max) ? list[index] : null;
  }
);


/**
 * Return length of given *list*.
 */
export const len = Builtin.of(
  Signature.of(['list', Type.List]),
  (list: ListType) => list.length
);


/**
 * Concatenate any number of lists.
 */
export const concat = Builtin.of(
  Signature.of(['lists', Type.List, Kind.Rest]),
  ([head, ...tail]: [...ListType[]]) => (
    (head) ? head.concat(...tail) : null
  )
);
