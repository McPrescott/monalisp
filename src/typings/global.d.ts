// -----------------------------------------------------------------------------
// -- GLOBAL TYPE DEFINITIONS
//------------------------------------------------------------------------------


// -- Character Stream ---------------------------------------------------------


declare namespace CharStream {
  export type State = {
    pos: number;
    line: number;
    column: number;
  };

  export type Info = {
    lineText: string;
    line: number;
    column: number;
  };
}


declare class CharStream {

  /**
   * Static constructor of `CharStream`.
   */
  static of(source: string): CharStream;

  private stateStack: CharStream.State[];
  private pos: number;
  private line: number;
  private column: number;
  private source: string;
  constructor(source: string);

  /**
   * Length of underlying string.
   */
  readonly length: number;

  /**
   * Current state.
   */
  readonly state: CharStream.State;

  /**
   * Current line of *source* input.
   */
  readonly currentLine: string;

  /**
   * Information about *this* `CharStream` at its current state.
   */
  readonly info: CharStream.Info;

  /**
   * Remaining portion of source string.
   */
  readonly rest: string;

  /**
   * Check whether all characters have been streamed.
   */
  isDone(): boolean;

  /**
   * Return current character, updating internal state.
   */
  next(): string;

  /**
   * Return current character without state change.
   */
  peek(): string;

  /**
   * Update internal state.
   */
  skip(): void;

  /**
   * Save current state.
   */
  save(): void;

  /**
   * Restore to most recently saved state.
   */
  restore(): void;

  /**
   * Remove most recently saved state without updating internal state.
   */
  unsave(): void;
}



// -- Parser -------------------------------------------------------------------


/**
 * Parse function signature of `Parser`.
 */
type ParseFn<T=any> = (stream: CharStream) => Result<T>;


/**
 * Result of `ParseFn`.
 */
type Result<T=any> = T | ParseFailure;



declare class ParseSuccess {
  toString(): string;
}



/**
 * Parsing failure type.
 */
declare class ParseFailure {

  /**
   * Static constructor of `ParseFailure`.
   */
  static of(message: string, label?: string, info?: CharStream.Info): ParseFailure;
  public message: string;
  public label: string;
  public info?: CharStream.Info;

  constructor(message: string, label?: string, info?: CharStream.Info);

  /**
   * Return error message for parse failure.
   */
  toString(): string;
}



/**
 * Type wrapper around a parser function.
 */
declare class Parser<T=any> {

  /**
   * Return `Parser` that ignores given *stream* and returns given *value*.
   */
  static return<T>(value: T): Parser<T>;

  /**
   * Static constructor function.
   */
  static of<T>(run: ParseFn<T>, label?: string): Parser<T>;


  public run: ParseFn<T>;
  public label?: string;
  constructor(run: ParseFn<T>, label?: string);

  /**
   * Return wrapping `Parser` that maps *fn* over successfully parsed value.
   */
  map<R>(fn: (parsed: T) => R): Parser<R>;

  /**
   * Return `Parser` that applies the successful result of *parser* to the
   * successful result of *this*.
   */
  apply<A>(parser: Parser<A>): Parser<T extends (a: A) => infer B ? B : null>;
}



declare enum ParseType {
  Nil,
  Bool,
  String,
  Number,
  Identifier,
  Keyword,
  List,
  Dictionary
}



declare class Parsed<T extends SExpr> {

  static of<T extends SExpr>(expression: T, type: ParseType, info: CharStream.Info): Parsed<T>;
  
  type: ParseType;
  info: CharStream.Info
  constructor(expression: T, type: ParseType, info: CharStream.Info);
}



// -- S-Expression -------------------------------------------------------------


declare class Identifier {
  static of(name: string): Identifier;
  public readonly name: string;
  constructor(name: string);
  toString(): string;
}


declare class Keyword {
  static of(key: string): Keyword;
  public readonly uid: Symbol;
  public readonly key: string;
  constructor(key: string);
}


type Atom =
  | null
  | boolean
  | string
  | number
  | Identifier
  | Keyword;

type SExpr =
  | Atom
  | List
  | Dict;

interface Dict extends Map<SExpr, SExpr> {}

interface List extends Array<SExpr> {}


// -- Builtin Extensions -------------------------------------------------------

interface NumberConstructor {
  empty(): number;
}


interface StringConstructor {
  empty(): string;
}


interface ArrayConstructor {
  empty(): any[];
}


// -- Convenience Function Types -----------------------------------------------

type AnyFn = (...args: any[]) => any;

type Unary<T=any, R=T> = (arg: T) => R;

type Binary<T0=any, T1=T0, R=T0> = (...args: [T0, T1]) => R;

type Ternary<T0=any, T1=T0, T2=T0, R=T0> = (...args: [T0, T1, T2]) => R;

type UnaryPred<T> = (arg: T) => boolean;

type GenericPred = <T extends any[]>(...args: T) => boolean;

type ArgsOf<T extends AnyFn> = (
  T extends ((...x: infer A) => any) ? A : never
);

type ReturnOf<T extends AnyFn> = (
  T extends ((...x: any[]) => (infer R)) ? R : never
);
