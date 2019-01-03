// -----------------------------------------------------------------------------
// -- SPECIAL FORM CLASS
//------------------------------------------------------------------------------


// TODO: Auto-curry when number of parameters is less than arity


import {apply} from '../../~hyfns';
import {didEvalFail} from '../eval-failure';
import {Callable} from './callable';
import {bind} from './bind';
import {Signature, verifyArity, typeCheck, transform} from './signature';


export enum ParameterKind {
  // Begin at one so no values are falsy
  Required=1,
  Optional=2,
  Rest=3
}


/**
 * List of parameters after application to `Signature`.
 */
type ParameterList = (TaggedReaderForm | TaggedReaderForm[])[];


/**
 * Function body of a `SpecialForm`.
 */
type Body = (scope: ScopeStackType, parameters: ParameterList) => (
  EvalResult
);




/**
 * Monalisp's `SpecialForm` class.
 */
export class SpecialForm extends Callable implements SpecialFormType {

  /**
   * Static factory function of `SpecialForm`.
   */
  static of(signature: Signature, body: Body) {
    return new SpecialForm(signature, body);
  }

  constructor(public signature: Signature, public body: Body) {
    super();
  }

  call(scope: ScopeStackType, parameters: TaggedReaderForm[]) {
    const parameterList = apply(parameters, bind(
      verifyArity(this.signature),
      typeCheck(this.signature),
      transform(this.signature)
    ));
    if (didEvalFail(parameterList)) {
      return parameterList
    }
    return this.body(scope, parameterList);
  }
}
