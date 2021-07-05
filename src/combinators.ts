import { Parser, parse } from "./parser";

/**
 * Parses one token. It's building block on the other combinators.
 */
export const item = new Parser(tokens =>
  tokens.length == 0 ? [] : [ [tokens[0], tokens.slice(1)] ]);

/**
 * Puts two combinators together: if the first one fails, it tries the other one.
 */
export const union = <A, B> (parser1: Parser<A>, parser2: Parser<B>) => new Parser<A | B>(tokens =>
  [...parse(tokens, parser1), ...parse(tokens, parser2)]);

/**
 * fails if `predicate` is false
 */
export const guard = (predicate: boolean): Parser<undefined> =>
  predicate ? Parser.pure(undefined) : Parser.fail()

/**
 * Parses the combinator as many times as it can.
 * Note it is non-deterministic, meaning it will try the combinator repeating
 * one time, two times, and so on.
 */
export const many = <T> (parser: Parser<T>): Parser<T[]> =>
  union(
    parser.bind(x =>
      many(parser).bind(xs =>
        Parser.pure([x, ...xs]))),
    Parser.pure([])
  );

/**
 * Parses one token if it corresponds to the given string; fails otherwise.
 */
export const literal = (expected: string) =>
  item.bind(token => token == expected ? Parser.pure(token) : Parser.fail<string>());

/**
 * Parses a number.
 * @example 42
 */
export const number = item.bind(token => !isNaN(+token) ? Parser.pure(+token) : Parser.fail<number>());

/**
 * Parses an unquoted string
 * @example hello
 * @see string
 */
export const unquotedString = item;

/**
 * Parses a quoted string.
 * @example "hello world"
 * @see string
 */
export const quotedString =
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
export const string = union(quotedString, unquotedString);
