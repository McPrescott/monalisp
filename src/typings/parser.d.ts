// -----------------------------------------------------------------------------
// -- PARSER TYPE DEFINITIONS
//------------------------------------------------------------------------------



// -- Character Stream ---------------------------------------------------------


declare namespace CharStream {
  type State = {
    pos: number;
    line: number;
    column: number;
  };
  type Info = {
    lineText: string;
    line: number;
    column: number;
  };
}

interface CharStreamConstructor {
  of(source: string): CharStreamType;
  new(source: string): CharStreamType;
  readonly prototype: CharStreamType;
}

interface CharStreamType {
  readonly isDone: boolean;
  readonly length: number;
  readonly currentLine: string;
  readonly rest: string;
  readonly state: CharStream.State;
  readonly info: CharStream.Info
  next(): string;
  peek(): string;
  skip(): void;
  save(): void;
  restore(): void;
  unsave(): void;
}



// -- Parser -------------------------------------------------------------------


type ParseResultType<T=any> = T | ParseFailureType;
type ParseFunctionType<T=any> = (stream: CharStreamType) => ParseResultType<T>;

interface ParseSuccessConstructor {
  new(): ParseSuccessType;
  readonly prototype: ParseSuccessType;
}

interface ParseSuccessType {
  toString(): string;
}

interface ParseFailureConstructor {
  of(message: string, label?: string, info?: CharStream.Info): ParseFailureType;
  new(message: string, label?: string, info?: CharStream.Info): ParseFailureType;
  readonly prototype: ParseFailureType;
}

interface ParseFailureType {
  message: string;
  label: string;
  info?: CharStream.Info;
  toString(): string;
}

interface ParserConstructor {
  return<T>(value: T): ParserType<T>;
  of<T>(fn: ParseFunctionType<T>): ParserType<T>;
  new<T>(fn: ParseFunctionType<T>): ParserType<T>;
  readonly prototype: ParserType<any>;
}

/**
 * *TODO*: Remove or fix apply method. 
 */
interface ParserType<T=any> {
  run: ParseFunctionType<T>;
  label?: string;
  map<U>(fn: (parsed: T) => U): ParserType<U>;
  // apply<A>(parser: IParser<A>): IParser<T extends (a: A) => infer B ? B : null>;
}
