import { literal, string, union } from "./combinators";
import { parse, Parser } from "./parser";

export interface Context {
  argument<T>(parser: Parser<T>, fn: (arg: T) => void): void,
  run(cb: () => void): void,
  combinator: Parser<unknown>
}

type CommandBuilder = (ctx: Context) => void;

class CommandBuildError extends Error {}

export const command = (builder: CommandBuilder) => {
  const { name } = builder;
  if (!name)
    throw new CommandBuildError("Provided builder function has no name");

  // push() when you branch
  // peek().push() for each branch possibility
  //
  // e.g., a command to look info about animes.
  // labels starting with a dollar sign represent arguments.
  // a star is when the command executes.
  //
  //               anime
  //           /           \
  //        $anime       random
  //      /       \        |
  //    info   character   *
  //      |        |
  //      *    $character
  //               |
  //               *
  //
  // a branching is a node
  // a branch possibility is a dash
  const stack: Parser<unknown>[][] = [];
  const peek = (): Parser<unknown>[] | undefined => stack[stack.length - 1];

  const parserFromFunction = (caller: () => void): Parser<unknown> => {
    stack.push([]);
    caller();
    const unionFromList = ([x, ...xs]: Parser<unknown>[]) => x ?
      union(x, unionFromList(xs)) :
      Parser.fail();
    const combinator = unionFromList(peek());
    stack.pop();

    return combinator;
  }

  const ctx: Context = {
    combinator: literal(name),
    run(cb: () => void) {
      peek().push(Parser.pure(cb));
    },
    argument<T>(parser: Parser<T>, fn: (arg: T) => void) {
      peek().push(parser);

      this.combinator = this.combinator.bind(parser.bind(value =>
        parserFromFunction(() => fn(value))))
    }
  };

  stack.push([]);
  builder(ctx);
  stack.pop();

  return ctx.combinator;
}
