const createTokens = (string: string) => ({})

type ParseResult<T> = ReadonlyArray<[T, string[]]>;

export const parse = <T> (tokens: string | string[], { f }: Parser<T>): ParseResult<T> =>
  f(typeof tokens == "string" ? tokens.split(" ") : tokens);

/**
 * A monadic parser.
 * @see https://www.cs.nott.ac.uk/~pszgmh/monparsing.pdf
 */
class Parser<Token> {
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

  static zero<T>(): Parser<T> {
    return new Parser(() => []);
  }
}

/**
 * Parses one token. It's building block on the other combinators.
 */
const item = new Parser(tokens => 
  tokens.length == 0 ? [] : [ [tokens[0], tokens.slice(1)] ]);

/**
 * Puts two combinators together: if the first one fails, it tries the other one.
 */
const union = <A, B> (parser1: Parser<A>, parser2: Parser<B>) => new Parser<A | B>(tokens =>
  [...parse(tokens, parser1), ...parse(tokens, parser2)]);

/**
 * fails if `predicate` is false
 */
const guard = (predicate: boolean): Parser<undefined> =>
  predicate ? Parser.pure(undefined) : Parser.zero()

/**
 * Parses the combinator as many times as it can.
 * Note it is non-deterministic, meaning it will try the combinator repeating
 * one time, two times, and so on.
 */
const many = <T> (parser: Parser<T>): Parser<T[]> =>
  union(
    parser.bind(x =>
      many(parser).bind(xs =>
        Parser.pure([x, ...xs]))),
    Parser.pure([])
  );

/**
 * Parses one token if it corresponds to the given string; fails otherwise.
 */
const literal = (expected: string) =>
  item.bind(token => token == expected ? Parser.pure(token) : Parser.zero<string>());

/**
 * Parses a number.
 * @example 42
 */
const number = item.bind(token => !isNaN(+token) ? Parser.pure(+token) : Parser.zero<number>());

/**
 * Parses an unquoted string
 * @example hello
 * @see string
 */
const unquotedString = item;

/**
 * Parses a quoted string.
 * @example "hello world"
 * @see string
 */
const quotedString =
  union(
    // parses a word that starts and ends with quotes
    item.bind(token => guard(token.startsWith(`"`) && token.endsWith(`"`))
      .bind(Parser.pure(token.slice(1, -1)))),

    // parses the first word with quotes
    item.bind(start => guard(start.startsWith(`"`))
      // parses the middle part
      .bind(many(unquotedString).bind(middle =>
        // parses the last word
        item.bind(end => guard(end.endsWith(`"`))
          // puts everything together and removes the quotes
          .bind(Parser.pure([start, ...middle, end].join(" ").slice(1, -1)))))))
  )

/**
 * Parses quoted and unquoted strings.
 * @see unquotedString
 * @see quotedString
 */
const string = union(quotedString, unquotedString);

const cmd = `"hello" world how are you" today`;
const p = many(string)
console.log(parse(cmd, p));
