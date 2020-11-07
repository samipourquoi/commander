// type Node = object;
import { Type } from "./types";

interface Node {
    run?: () => void;
    validate: (input: string) => boolean;
    children: Node[];
}

let indent: number = 0;

export class Command {
    public register: Brancher;
    public tree: Node = {
        validate: (input: string) => true,
        children: []
    };

    constructor() {
        this.register = new Brancher(null, this.tree);
    }

    run(input: string): boolean {
        let words: string[] = input.split(" ");
        let node: Node | undefined = this.tree;

        // Consumes all the words
        while (words.length > 0) {
            let word: string = words.shift() as string
            node = node.children.find(entry => entry.validate(word))
            if (!node) return false;
        }

        if (node.run) {
            node.run();
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

    run(fun: () => void): Brancher {
        this.last.run = fun;
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
            validate: type.validate
        });
        return this.brancher;
    }

    literal(word: string): Brancher {
        this.path.children.push(this.brancher.last = {
            children: [],
            validate: (input: string) => input == word
        });
        return this.brancher;
    }
}