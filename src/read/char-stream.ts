// -----------------------------------------------------------------------------
// -- CHARACTER STREAM
//------------------------------------------------------------------------------


import {NL, NULL, EMPTY} from "./common/chars";


export namespace CharStream {
  export type State = {
    pos: number;
    line: number;
    column: number;
  }
  export type Info = {
    lineText: string;
    line: number;
    column: number;
  }
}



export class CharStream {

  /**
   * Static constructor of `CharStream`.
   */
  static of(source: string) {
    return new CharStream(source);
  }

  private stateStack: CharStream.State[] = [];
  private pos: number = 0;
  private line: number = 0;
  private column: number = 0;
  constructor(private source: string) {}

  /**
   * Length of underlying string.
   */
  get length(): number {
    return this.source.length;
  }

  /**
   * Current state.
   */
  get state(): CharStream.State {
    const {pos, line, column} = this;
    return {pos, line, column};
  }

  /**
   * Current line of *source* input.
   */
  get currentLine(): string {
    const {pos, column, source} = this;
    const lineStart = pos - column;
    let lineEnd = source.indexOf(NL, pos);
    (lineEnd === -1) && (lineEnd = undefined);
    const lineText = source.slice(lineStart, lineEnd);
    return lineText;
  }

  /**
   * Information about *this* `CharStream` at its current state.
   */
  get info(): CharStream.Info {
    const {line, column} = this;
    const lineText = this.currentLine;
    return {lineText, line, column};
  }

  /**
   * Remaining portion of source string.
   */
  get rest(): string {
    return this.source.slice(this.pos);
  }

  /**
   * Return current character, updating internal state.
   */
  next() {
    if (this.pos >= this.length)
      return EMPTY;
    const char = this.source[this.pos++];
    if (char === NL) {
      this.line++;
      this.column = 0;
    }
    return char;
  }

  /**
   * Return current character without state change.
   */
  peek() {
    if (this.pos >= this.length)
      return EMPTY;
    return this.source[this.pos];
  }

  /**
   * Update internal state.
   */
  skip() {
    if (this.pos >= this.length)
      return;

    const char = this.source[this.pos];
    if (char === NL) {
      this.line++;
      this.column = 0;
    }
    this.pos++;
  }

  /**
   * Save current state.
   */
  save() {
    this.stateStack.push(this.state);
  }

  /**
   * Restore to most recently saved state.
   */
  restore() {
    const state = this.stateStack.pop();
    this.pos = state.pos;
    this.line = state.line;
    this.column = state.column;
  }

  /**
   * Remove most recently saved state without updating internal state.
   */
  unsave() {
    this.stateStack.pop();
  }
}
