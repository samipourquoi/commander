// type Node = object;
import { Type } from "./types";

// TODO: Generify `Node` interface
interface Node {
	run?: (w?: any) => void;
	doc?: Documentation
	parse: (word: string) => any;
	validate: (input: string, consumer?: string[]) => boolean;
	children: Node[];
}

type Documentation = {
	name?: string,
	alias?: string[],
	description?: string,
	onlyFor?: string,
	requires?: string,
	usage?: string[] | string,
	author?: string
};

let indent: number = 0;

export class Command {
	public register: Brancher;
	public tree: Node = {
		parse: () => "root",
		validate: () => true,
		children: []
	};

	constructor() {
		this.register = new Brancher(null, this.tree);
	}

	run(input: string): boolean {
		let words: string[] = input.split(" ");
		let node: Node | undefined = this.tree;
		let word: string;

		// Consumes all the words
		do {
			word = words.shift() as string;
			node = node.children.find(entry => entry.validate(word, words))
			if (!node) return false;
		} while (words.length > 0);

		if (node.run) {
			node.run(node.parse(word));
			return true;
		} else {
			return false;
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
		indent++;
		return new Register(new Brancher(this, this.last));
	}

	get or(): Register {
		return new Register(this);
	}

	get end(): Brancher | null {
		indent--;
		return this.parent;
	}

	run(fun: (w: any) => void): Brancher {
		this.last.run = fun;
		return this;
	}

	doc(info: Documentation): Brancher {
		this.last.doc = info;
		return this;
	}
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

	literal(word: string): Brancher {
		this.path.children.push(this.brancher.last = {
			children: [],
			validate: (input: string) => input == word,
			parse: () => word
		});
		return this.brancher;
	}
}