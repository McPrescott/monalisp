import {NL, NULL} from "./common/chars";


export type State = {
  pos: number;
  line: number;
  col: number;
}


export class CharStream {
  private stateStack: State[] = [];
  private pos: number = 0;
  private line: number = 0;
  private col: number = 0;
  constructor(private source: string) {}

  /**
   * Length of underlying string.
   */
  get length() {
    return this.source.length;
  }

  /**
   * Current state.
   */
  get state(): State {
    const {pos, line, col} = this;
    return {pos, line, col};
  }

  /**
   * Remaining portion of source string.
   */
  get rest() {
    return this.source.slice(this.pos);
  }

  /**
   * Return current character, updating internal state.
   */
  next() {
    if (this.pos >= this.length)
      return NULL;
    const char = this.source[this.pos++];
    if (char === NL) {
      this.line++;
      this.col = 0;
    }
    return char;
  }

  /**
   * Return current character without state change.
   */
  peek() {
    if (this.pos >= this.length)
      return '';
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
      this.col = 0;
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
    this.col = state.col;
  }
}
