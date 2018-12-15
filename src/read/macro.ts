// -----------------------------------------------------------------------------
// -- MACRO PARSER
//------------------------------------------------------------------------------


import {ParseFailure, Parser, run, plabel} from './parse/parser';
import {macroTable} from './macros/table';


/**
 * Monalisp reader macro `Parser`.
 */
export const macroParser = Parser.of((stream) => {
  if (stream.peek() in macroTable) {
    return run(macroTable[stream.next()], stream);
  }
  return ParseFailure.of(
    `${stream.peek()} is not a macro character`,
    'macro',
    stream.info
  );
}, 'reader-macro');
