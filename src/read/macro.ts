// -----------------------------------------------------------------------------
// -- MACRO PARSERS
//------------------------------------------------------------------------------



// Reader macro parses certain macro characters or character sequence, parses
// and transforms with a corresponding function, the next expression.

// export namespace ReaderMacros {
//   export type Macro = (stream: CharStream) => Plus<Tagged<SExpr>>;
//   const table: {[key: string]: Macro} = Object.create(null);
//   // Macro character has already been parsed. Now this macro should read the
//   // next form, which in this case should be a function body, which would be a
//   // list, or a list of lists.
//   table['•'] = (stream) => {
//     const popen = pair(pchar(OPEN_PAREN), anySpace);
//     const pclose = pair(anySpace, pchar(CLOSE_PAREN));
//     const pdot = pmap((_) => Identifier.of('_'), pchar(DOT));
//     const atom = choice([pdot, Atom.parser]);
//     const contents = series(atom, someSpace);
//     const listParser = plabel('• macro', between(popen, contents, pclose));
//     return run(listParser, stream);
//   }
// }