// -----------------------------------------------------------------------------
// -- CHARACTER STREAM
//------------------------------------------------------------------------------


import {NL, EMPTY} from './common/chars';


export class CharStream implements CharStreamType {

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
   * Check whether all characters have been streamed.
   */
  get isDone(): boolean {
    return this.pos >= this.length;
  }

  /**
   * Return current character, updating internal state.
   */
  next(): string {
    if (this.pos >= this.length)
      return EMPTY;
    const char = this.source[this.pos++];
    if (char === NL) {
      this.line++;
      this.column = 0;
    }
    else {
      this.column++;
    }
    return char;
  }

  /**
   * Return current character without state change.
   */
  peek(): string {
    if (this.pos >= this.length)
      return EMPTY;
    return this.source[this.pos];
  }

  /**
   * Update internal state.
   */
  skip(): void {
    if (this.pos >= this.length)
      return;
    const char = this.source[this.pos];
    if (char === NL) {
      this.line++;
      this.column = 0;
    }
    else {
      this.column++;
    }
    this.pos++;
  }

  /**
   * Save current state.
   */
  save(): void {
    this.stateStack.push(this.state);
  }

  /**
   * Restore to most recently saved state.
   */
  restore(): void {
    const state = this.stateStack.pop();
    this.pos = state.pos;
    this.line = state.line;
    this.column = state.column;
  }

  /**
   * Remove most recently saved state without updating internal state.
   */
  unsave(): void {
    this.stateStack.pop();
  }
}
