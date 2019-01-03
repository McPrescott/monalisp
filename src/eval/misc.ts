// -----------------------------------------------------------------------------
// -- CURRENTLY UNCATEGORIZED HELPERS
//------------------------------------------------------------------------------


import {FormFlag, formFlagOf} from '../common/form-flag';
import {ReaderTag} from '../read/tagging';
import {EvalFailure, didEvalFail} from './eval-failure';


/**
 * Strip expression from given *form* and from any nested `TaggedReaderForm`. 
 */
export const stripExpression = (form: TaggedReaderForm): EvalForm => {
  const {expression} = form;
  if (Array.isArray(expression)) {
    return expression.map(stripExpression);
  }
  if (expression instanceof Map) {
    const dictionary = new Map()
    for (const [key, value] of expression) {
      dictionary.set(stripExpression(key), stripExpression(value));
    }
    return dictionary;
  }
  return expression;
};



export const tagExpanded = (
  (form: EvalForm, info: CharStream.Info): EvalResult<TaggedReaderForm> => {
    const formFlag = formFlagOf(form);
    if (formFlag === FormFlag.Procedure) {
      const message = `Reader forms cannot be of type Procedure.`;
      return EvalFailure.of(message, info)
    }
    if (Array.isArray(form)) {
      const taggedForms: TaggedReaderForm[] = [];
      for (const element of form) {
        const taggedForm = tagExpanded(element, info);
        if (didEvalFail(taggedForm)) {
          return taggedForm;
        }
        taggedForms.push(taggedForm);
      }
      return ReaderTag.fromExpanded(
        taggedForms,
        formFlag as ReaderFormFlagType,
        info
      );
    }
    if (form instanceof Map) {
      const taggedForms: ReaderDictionaryType = new Map();
      for (const [key, value] of form) {
        const taggedKey = tagExpanded(key, info);
        if (didEvalFail(taggedKey)) {
          return taggedKey;
        }
        const taggedValue = tagExpanded(value, info);
        if (didEvalFail(taggedValue)) {
          return taggedValue;
        }
        taggedForms.set(taggedKey, taggedValue);
      }
      return ReaderTag.fromExpanded(
        taggedForms,
        formFlag as ReaderFormFlagType,
        info
      );
    }
    return ReaderTag.fromExpanded(
      form as ReaderForm,
      formFlag as ReaderFormFlagType,
      info
    );
  }
);