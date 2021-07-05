export type ParseResult<T> = ReadonlyArray<[T, string[]]>;

export const parse = <T> (tokens: string | string[], { f }: Parser<T>): ParseResult<T> =>
  f(typeof tokens == "string" ? tokens.split(" ") : tokens);

/**
 * A monadic parser.
 * @see https://www.cs.nott.ac.uk/~pszgmh/monparsing.pdf
 */
export class Parser<Token> {
  constructor(public f: (tokens: string[]) => ParseResult<Token>) {
  }

  bind<T>(f: Parser<T> | ((token: Token) => Parser<T>)): Parser<T> {
    return new Parser(tokens =>
      parse(tokens, this)
        .map(( [token, tokens] ) => parse(tokens, typeof f == "function" ? f(token) : f))
        .flat());
  }

  static pure<T>(token: T): Parser<T> {
    return new Parser(tokens => [[token, tokens]]);
  }

  static fail<T>(): Parser<T> {
    return new Parser(() => []);
  }
}