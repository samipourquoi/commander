// type Node = object;
interface Node {
    run?: () => void;
    validate?: (input: string) => boolean;
    children: Record<string, Node>;
}

let indent: number = 0;

export class Command {
    public register: Brancher;
    public tree: Node = { children: {} };

    constructor() {
        this.register = new Brancher(null, this.tree);
    }

    run(input: string): boolean {
        let words: string[] = input.split(" ");
        let node: Node = this.tree[words[0]];
        console.log(node);

        return true;
    }
}

export class Brancher {
    public parent: Brancher;
    public path: Node;
    public last: Node | null = null;

    constructor(parent: Brancher | null, path?: Node) {
        this.parent = parent;
        this.path = path ?? parent.path;
    }

    get with(): Register {
        indent++;
        return new Register(new Brancher(this, this.last));
    }

    get or(): Register {
        return new Register(this);
    }

    get end(): Brancher {
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

    number(): Brancher {
        return this.brancher;
    }

    literal(name: string): Brancher {
        this.brancher.last = this.path.children[name] = { children: {} };
        console.log(`${" ".repeat(indent)}${name}`);
        return this.brancher;
    }
}