// -- Stack Tracing ------------------------------------------------------------


interface StackFrameType {

  /**
   * `Identifier` of the called function.
   */
  id?: IdentifierType;

  /**
   * Information about the position in source where the function was called.
   */
  info: CharStream.Info;
}


interface StackTraceType extends Array<StackFrameType> {}