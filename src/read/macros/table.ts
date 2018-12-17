// -----------------------------------------------------------------------------
// -- READER MACRO TABLE
//------------------------------------------------------------------------------


import {QUOTE, BULLET} from '../parse/common/chars';
import {quoteMacro} from './quote';
import {bulletMacro} from './bullet';


/**
 * The reader macro table.
 */
export const macroTable: Table<ParserType<ReaderForm>> = Object.create(null);


macroTable[QUOTE] = quoteMacro;
macroTable[BULLET] = bulletMacro;
