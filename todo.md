TODO LIST
================================================================================


## Agenda Items ##

  + [x] Refactor `parse/parsers/combinators` functions to remove label argument
  + [x] Improve error messages for `read/reader`
  + [x] *Fix:* Reader macros only parsed at top level
  + [x] Refactor types into ambient interface declarations
    + [x] Consider possibilities for generics in `ParseTagConstructor`
    + [x] Fix `CharStream.isDone` for `completion` combinator
  + [x] Investigate interpreter strategies instead of `eval` module
  + [x] Move IdentifierTable into `common/identifier.ts`
  + [x] Unification of Reader and Evaluation forms
  + [ ] Consider making IDTable, and KeywordTable, WeakMaps
  + [ ] Evaluation macros
  + [ ] Consider making fref of type `{ref: ParserType, parser: ParserType}`.
  + [ ] Remove `CharStream.Info.lineText`, ~Create `CharStream.Error`


## Questions ##

  + Should `ScopeStack` define, always use the innermost scope, or could it
    perhaps use the innermost scope when no nonconst variables are found on the
    stack?
  + What behaviour should occur when an undefined identifier is attempting to be
    resolved?
