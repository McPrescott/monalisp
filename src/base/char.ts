export class Char extends String {

  static fromCode(charCode: number) {
    return new Char(String.fromCharCode(charCode));
  }

  static of(char: string) {
    return new Char(char);
  }

  constructor(char: string) {
    if (char.length != 1)
      throw new TypeError('Char must be one character string.');
    super(char);
    Object.freeze(this);
  }
}