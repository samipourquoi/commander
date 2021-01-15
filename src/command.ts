// type Node = object;
import { Type } from "./types";

// TODO: Generify `Node` interface
interface Node {
	run?: (ctx: Context<any>) => any;
	doc?: Documentation;
	parse: (word: string, words: string[]) => any;
	validate: (input: string, consumer?: string[]) => boolean;
	children: Node[];
}

export type Documentation = {
	name?: string,
	alias?: string[],
	description?: string,
	onlyFor?: string,
	requires?: string,
	usage?: string[] | string,
	author?: string
};

/**
 * Closure being the data to pass to the `run` functions.
 */
export type Context<Closure> = {
	/**
	 * Parsed argument
	 */
	arg: any;

	/**
	 * List of all parsed arguments
	 */
	args: any[];
} & Closure;

export class Command<Closure = unknown, T = any> {
	public register: Brancher;
	public tree: Node = {
		parse: () => "root",
		validate: () => true,
		children: []
	};

	constructor() {
		this.register = new Brancher(null, this.tree);
	}

	run(input: string, closure?: Closure): T | never {
		let words: string[] = input.split(" ");
		let node: Node | undefined = this.tree;
		let word: string;
		let o: any[] = [];

		// Consumes all the words
		do {
			word = words.slice().shift() as string;
			node = node.children.find(entry => entry.validate(word, words.slice()))
			o.push(node?.parse(word, words));
			if (!node) throw new Error(`Unable to find command: ${input}`);
		} while (words.length > 0);

		if (node.run) {
			return node.run({
				arg: o[o.length-1],
				args: o,
				...closure
			});
		} else {
			throw new Error(`Command is not executable: ${input}`);
		}
	}
}

export class Brancher {
	public parent: Brancher | null;
	public path: Node;
	public last: Node;

	constructor(parent: Brancher | null, path?: Node) {
		this.parent = parent;
		// `path` should always be defined when `parent` is null
		this.path = path ?? (parent as Brancher).path;
		this.last = this.path;
	}

	get with(): Register {
		return new Register(new Brancher(this, this.last));
	}

	get or(): Register {
		return new Register(this);
	}

	get end(): Brancher | null {
		return this.parent;
	}

	run(fun: (context: Context<any>) => void): Brancher {
		this.last.run = fun;
		return this;
	}

	doc(info: Documentation): Brancher {
		this.last.doc = info;
		return this;
	}

	/**	The following properties are only there
		to let people use the syntax with beautiful indentation,
		while using a Linter of some sort that would break
		the alignment of the method calls.
		A way to avoid having to do such a thing would be to
		use functions with the .with() method.
		e.g. the following would represent the command `cmd (foo bar|fubar)`:

		```
		this.register.with(r => {
			r.literal("cmd").with(r => {
				r.literal("foo").with(r => {
					r.literal("bar").run(() => console.log("it's a foo bar!")
				})
				.or.literal("fubar").run(() => console.log("it's a fubar!");;
			});
		});
		```

		I just consider this hurts the readability, which I aim to
		ease as much as I can. The code would look like this with
		that trick:

		```
		this.register.with.literal("cmd")
			.with.literal("foo")
			.____.with.literal("bar").run(() => console.log("it's a foo bar!")).end
			.or.literal("fubar").run(() => console.log("it's a fubar!"));
		```
	 */
	public _____ 	= this;
	public ____ 	= this;
	public ___ 		= this;
	public __ 		= this;
	public _ 		= this;
}

export class Register {
	private readonly brancher: Brancher;
	private path: Node;

	constructor(brancher: Brancher) {
		this.brancher = brancher;
		this.path = brancher.path;
	}

	arg(name: string, fn: () => Type<unknown>): Brancher {
		let type: Type<unknown> = fn();
		this.path.children.push(this.brancher.last = {
			children: [],
			validate: type.validate,
			parse: type.parse
		});
		return this.brancher;
	}

	literal(...words: string[]): Brancher {
		this.path.children.push(this.brancher.last = {
			children: [],
			validate: (input: string) => words.includes(input),
			parse: (_, _words) => {
				return _words.shift()!;
			}
		});
		return this.brancher;
	}

	use(command: Command): Brancher { return this.attach(command); }

	attach(command: Command): Brancher {
		this.path.children = this.path.children.concat(command.tree.children);
		return this.brancher;
	}
}
