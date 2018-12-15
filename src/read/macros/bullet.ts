// -----------------------------------------------------------------------------
// -- BULLET MACRO (•)
//------------------------------------------------------------------------------


import {Identifier} from '../../builtin/identifier';
import {DOT} from '../parse/common/chars';
import {Regex} from '../parse/common/regex';
import {toInt} from '../parse/common/transformers';
import {CharStream} from '../parse/char-stream';
import {Parser, run, pmap, didParseFail, ParseFailure} from '../parse/parser';
import {after, attempt, choice} from '../parse/parsers/combinators';
import {pchar, satisfyRegex} from '../parse/parsers/string';
import {Tagged, ParseType} from '../tagging';
import {getIdentifier} from '../identifier';
import {listParserOf} from '../list';
import {SExpression, sExpressionParser, List} from '../s-expression';


const pdot = pchar(DOT);
const pindexed = attempt(after(pdot, pmap(toInt, satisfyRegex(Regex.Digit))));
const parg = choice<string|number>(pindexed, pdot);


/**
 * Return `Tagged<Identifier>` for corresponding bullet macro argument.
 */
const getArgIdentifier = (n: number, info: CharStream.Info) => (
  Tagged.fromExpanded(
    getIdentifier(`arg${n}`),
    ParseType.Identifier,
    info
  )
);


/**
 * Return expanded list of `Tagged<Idnetifier>`.
 */
const getArgList = (total: number, info: CharStream.Info) => {
  let argList = [];
  for(let i=1; i<=total; i++)
    argList.push(getArgIdentifier(i, info));
  return Tagged.fromExpanded(argList, ParseType.List, info);
}


/**
 * Return new `Parser` for bullet macro arguments.
 */
const argumentParser = () => {
  let state: {n: number, parser: Parser<Tagged<Identifier>>} = {
    n: 0,
    parser: null
  };
  let areAllUnindexed = true;
  state.parser = Parser.of((stream) => {
    const info = stream.info;
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
    return getArgIdentifier(argNumber, info) as Tagged<Identifier>;
  });
  return state;
};


/**
 * Return `Tagged<Identifier>` with given `CharStream` *info*.
 */
const expanded = (
    expression: Tagged<SExpression>[],
    argNumber: number,
    info: CharStream.Info
  ) => (
  [
    Tagged.fromExpanded(getIdentifier('fn'), ParseType.Identifier, info),
    getArgList(argNumber, info),
    expression
  ]
);


/**
 * Monalisp's bullet macro (`•`).
 */
export const bulletMacro: Parser<SExpression> = Parser.of((stream) => {
  const info = stream.info;
  const args = argumentParser();
  const elementParser = choice(sExpressionParser, args.parser);
  const parser = listParserOf(elementParser);
  const expression = run(parser,  stream);
  if (didParseFail(expression))
    return expression;
  return expanded(expression, args.n, info) as List;
});
