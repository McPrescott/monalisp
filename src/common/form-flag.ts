// -----------------------------------------------------------------------------
// -- FORM FLAG ENUMERATION
//------------------------------------------------------------------------------


import {Identifier} from './identifier';
import {Keyword} from './keyword';


/**
 * Enumeration of possible form types.
 */
export const FormFlag: FormFlagType = {
  Nil         : 0o1,
  Boolean     : 0o2,
  Number      : 0o4,
  String      : 0o10,
  Identifier  : 0o20,
  Keyword     : 0o40,
  List        : 0o100,
  Dictionary  : 0o200,
  Callable    : 0o400,
  Any         : 0o777
}


/**
 * Return `FormFlag` of given *form*.
 */
export const formFlagOf = <T extends FormType>(form: FormType): FormFlagOf<T> => (
  ((form === null) ? FormFlag.Nil
  : (form instanceof Identifier) ? FormFlag.Identifier
  : (form instanceof Keyword) ? FormFlag.Keyword
  : (Array.isArray(form)) ? FormFlag.List
  : (form instanceof Map) ? FormFlag.Dictionary
  : (typeof form === 'boolean') ? FormFlag.Boolean
  : (typeof form === 'number') ? FormFlag.Number
  : (typeof form === 'string') ? FormFlag.String
  : FormFlag.Callable) as FormFlagOf<T>
);


/**
 * Return whether given flags overlap.
 */
export const isTypeMatch = (flag1: number, flag2: number) => (
  flag1 & flag2
);


/**
 * Return whether given flags do NOT overlap
 */
export const isNotTypeMatch = (flag1: number, flag2: number) => (
  !(flag1 & flag2)
);


/**
 * Return name(s) of types associated with given *flag*.
 */
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
  if (flag & FormFlag.Callable) {
    names.push('Procedure');
  }
  return names.join(' | ');
}