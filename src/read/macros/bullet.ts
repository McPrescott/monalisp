// -----------------------------------------------------------------------------
// -- BULLET MACRO (•)
//------------------------------------------------------------------------------


import {DOT} from '../parse/common/chars';
import {Regex} from '../parse/common/regex';
import {toInt} from '../parse/common/transformers';
import {Parser, run, pmap, didParseFail, ParseFailure} from '../parse/parser';
import {after, attempt, choice} from '../parse/parsers/combinators';
import {pchar, satisfyRegex} from '../parse/parsers/string';
import {FormFlag as Type} from '../../common/form-flag';
import {variable} from '../../common/variable';
import {getIdentifier} from '../../common/identifier';
import {listParserOf} from '../list';
import {readerFormParser} from '../s-expression';


const pdot = pchar(DOT);
const pindexed = attempt(after(pdot, pmap(toInt, satisfyRegex(Regex.Digit))));
const parg = choice<string|number>(pindexed, pdot);


/**
 * Return `Tagged<Identifier>` for corresponding bullet macro argument.
 */
const getArgIdentifier = (n: number, state: CharStream.State): VarType => (
  variable(getIdentifier(`arg${n}`) as IdentifierType, state)
);


/**
 * Return expanded list of `Tagged<Idnetifier>`.
 */
const getArgList = (total: number, state: CharStream.State): VarType => {
  let argList = [];
  for(let i=1; i<=total; i++)
    argList.push(getArgIdentifier(i, state));
  return variable(argList, state);
}


/**
 * Return new `Parser` for bullet macro arguments.
 */
const argumentParser = () => {
  let state: {n: number, parser: ParserType<VarType>} = {
    n: 0,
    parser: null
  };

  let areAllUnindexed = true;
  state.parser = Parser.of((stream) => {
    const {state: streamState} = stream;
    const result = run(parg, stream);
    if (didParseFail(result))
      return result;

    // get argument number
    let argNumber: number;
    if (typeof result === 'number') {
      argNumber = result;
      areAllUnindexed = false;
      ((state.n < argNumber) && (state.n = argNumber));
    }
    else if (areAllUnindexed) {
      argNumber = ++state.n;
    }
    else {
      return ParseFailure.of(
        'Unindexed arguments may not follow indexed arguments.',
        'bullet macro (•)',
        stream.info
      );
    }
    return getArgIdentifier(argNumber, streamState);
  });
  return state;
};


/**
 * Return `Tagged<Identifier>` with given `CharStream` *info*.
 */
const expanded = (
  expression: VarType[],
  argNumber: number,
  state: CharStream.State
) => ([
  variable(getIdentifier('fn'), state),
  getArgList(argNumber, state),
  expression
] as ListType);


/**
 * Monalisp's bullet macro (`•`).
 */
export const bulletMacro: ParserType<ListType> = Parser.of((stream) => {
  const {state} = stream;
  const args = argumentParser();
  const elementParser = choice(readerFormParser, args.parser);
  const parser = listParserOf(elementParser);
  const expression = run(parser,  stream);
  if (didParseFail(expression))
    return expression;
  return expanded(expression, args.n, state);
});
