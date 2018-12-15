// -----------------------------------------------------------------------------
// -- READER MACRO TABLE
//------------------------------------------------------------------------------


import {QUOTE, BULLET} from '../parse/common/chars';
import {Parser} from '../parse/parser';
import {SExpression} from '../s-expression';
import {quoteMacro} from './quote';
import {bulletMacro} from './bullet';


/**
 * Reader macro type.
 */
export type Macro = Parser<SExpression>;


/**
 * The reader macro table.
 */
export const macroTable: {[key: string]: Macro} = Object.create(null);


macroTable[QUOTE] = quoteMacro;
macroTable[BULLET] = bulletMacro;