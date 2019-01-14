// -----------------------------------------------------------------------------
// -- SPECIAL FORM CLASS
//------------------------------------------------------------------------------


// TODO: Auto-curry when number of parameters is less than arity


import {apply} from '../../../~hyfns';
import {didEvalFail} from '../../eval-failure';
import {Callable} from './callable';
import {evalChain} from '../bind';
import {Signature, verifyArity, typeCheck} from './signature';


export enum ParameterKind {
  // Begin at one so no values are falsy
  Required=1,
  Optional=2,
  Rest=3
}


/**
 * Function body of a `SpecialForm`.
 */
type Body = (scope: ScopeStackType, ...parameters: VarType[]) => (
  EvalResult
);



/**
 * Monalisp's `SpecialForm` class.
 */
export class SpecialForm extends Callable {

  /**
   * Static factory function of `SpecialForm`.
   */
  static of(signature: Signature, body: Body) {
    return new SpecialForm(signature, body);
  }

  constructor(public signature: Signature, public body: Body) {
    super();
  }

  get shouldEvaluateParameters() {
    return false;
  }

  call(scope: ScopeStackType, parameters: ListVar) {
    const parameterList = apply(parameters.expr, evalChain(
      verifyArity(this.signature),
      typeCheck(this.signature)
    ));
    if (didEvalFail(parameterList)) {
      return parameterList
    }
    return this.body(scope, ...parameterList);
  }
}
