type Node = object;

let indent: number = 0;

export class Command {
    public register: Brancher;
    public tree: Node = { };

    constructor() {
        this.register = new Brancher(null, this.tree);
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
        this.path[name] = { };
        this.brancher.last = this.path[name];
        console.log(`${" ".repeat(indent)}${name}`);
        return this.brancher;
    }
}