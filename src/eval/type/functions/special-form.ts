// -----------------------------------------------------------------------------
// -- SPECIAL FORM CLASS
//------------------------------------------------------------------------------


// TODO: Auto-curry when number of parameters is less than arity


import {Callable} from './callable';
import {Signature, verifyArity, verifyTypes} from './common-signature';
import {rbind} from '../../misc';

/**
 * Function body of a `SpecialForm`.
 */
type Body = (scope: ScopeStackType, ...parameters: VarType[]) => EvalResult;



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
    return rbind(
      verifyArity(this.signature, parameters.form),
      verifyTypes(this.signature),
      (parameters) => this.body(scope, ...parameters)
    );
  }
}
