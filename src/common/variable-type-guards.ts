// -----------------------------------------------------------------------------
// -- TYPE GUARDS FOR THE VARIABLE DISCRIMINATED UNION
//------------------------------------------------------------------------------


import {FormFlag} from './form-flag';


/**
 * `VarType` without `T`.
 */
type Not<T extends VarType> = Exclude<VarType, T>;


/**
 * Return whether `VariableType` is `NilVariable`.
 */
export const isNil = (form: VarType): form is NilVar => (
  form.type === FormFlag.Nil
);


/**
 * Return whether `VariableType` is NOT `NilVariable`.
 */
export const isNotNil = (form: VarType): form is Not<NilVar> => (
  form.type !== FormFlag.Nil
);


/**
 * Return whether `VariableType` is `BooleanVariable`.
 */
export const isBoolean = (form: VarType): form is BooleanVar => (
  form.type === FormFlag.Boolean
);


/**
 * Return whether `VariableType` is NOT `BooleanVariable`.
 */
export const isNotBoolean = (form: VarType): form is Not<BooleanVar> => (
  form.type !== FormFlag.Boolean
);


/**
 * Return whether `VariableType` is `NumberVariable`.
 */
export const isNumber = (form: VarType): form is NumberVar => (
  form.type === FormFlag.Number
);


/**
 * Return whether `VariableType` is NOT `NumberVariable`.
 */
export const isNotNumber = (form: VarType): form is Not<NumberVar> => (
  form.type !== FormFlag.Number
);


/**
 * Return whether `VariableType` is `StringVariable`.
 */
export const isString = (form: VarType): form is StringVar => (
  form.type === FormFlag.String
);


/**
 * Return whether `VariableType` is NOT `StringVariable`.
 */
export const isNotString = (form: VarType): form is Not<StringVar> => (
  form.type !== FormFlag.String
);


/**
 * Return whether `VariableType` is `IdentifierVariable`.
 */
export const isIdentifier = (form: VarType): form is IdentifierVar => (
  form.type === FormFlag.Identifier
);


/**
 * Return whether `VariableType` is NOT `IdentifierVariable`.
 */
export const isNotIdentifier = (form: VarType): form is Not<IdentifierVar> => (
  form.type !== FormFlag.Identifier
);


/**
 * Return whether `VariableType` is `KeywordVariable`.
 */
export const isKeyword = (form: VarType): form is KeywordVar => (
  form.type === FormFlag.Keyword
);


/**
 * Return whether `VariableType` is NOT `KeywordVariable`.
 */
export const isNotKeyword = (form: VarType): form is Not<KeywordVar> => (
  form.type !== FormFlag.Keyword
);


/**
 * Return whether `VariableType` is `ListVariable`.
 */
export const isList = (form: VarType): form is ListVar => (
  form.type === FormFlag.List
);


/**
 * Return whether `VariableType` is `ListVariable`.
 */
export const isNotList = (form: VarType): form is Not<ListVar> => (
  form.type !== FormFlag.List
);



/**
 * Return whether `VariableType` is `DictionaryVariable`.
 */
export const isDictionary = (form: VarType): form is DictionaryVar => (
  form.type === FormFlag.Dictionary
);


/**
 * Return whether `VariableType` is NOT `DictionaryVariable`.
 */
export const isNotDictionary = (form: VarType): form is Not<DictionaryVar> => (
  form.type !== FormFlag.Dictionary
);


/**
 * Return whether `VariableType` is `CallableVariable`.
 */
export const isCallable = (form: VarType): form is CallableVar => (
  form.type === FormFlag.Callable
);


/**
 * Return whether `VariableType` is NOT `CallableVariable`.
 */
export const isNotCallable = (form: VarType): form is Not<CallableVar> => (
  form.type !== FormFlag.Callable
);
