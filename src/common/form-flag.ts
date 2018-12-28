// -----------------------------------------------------------------------------
// -- FORM FLAG ENUMERATION
//------------------------------------------------------------------------------


/**
 * Enumeration of possible `SExpression` types.
 */
export enum FormFlag {
  Nil         = 0o1,
  Boolean     = 0o2,
  Number      = 0o4,
  String      = 0o10,
  Identifier  = 0o20,
  Keyword     = 0o40,
  List        = 0o100,
  Dictionary  = 0o200,
  Procedure   = 0o400,
  Any         = 0o777
}


export const formFlagName = (flag: number) => {
  if (flag in FormFlag) {
    return FormFlag[flag];
  }

  let names: string[] = [];
  if (flag & FormFlag.Nil) {
    names.push('Nil');
  }
  if (flag & FormFlag.Boolean) {
    names.push('Boolean');
  }
  if (flag & FormFlag.Number) {
    names.push('Number');
  }
  if (flag & FormFlag.String) {
    names.push('String');
  }
  if (flag & FormFlag.Identifier) {
    names.push('Identifier');
  }
  if (flag & FormFlag.Keyword) {
    names.push('Keyword');
  }
  if (flag & FormFlag.List) {
    names.push('List');
  }
  if (flag & FormFlag.Dictionary) {
    names.push('Dictionary');
  }
  if (flag & FormFlag.Procedure) {
    names.push('Procedure');
  }
  return names.join(' | ');
}