export class Command {
    public register: Brancher;
    public tree: string = "";
    public indent: number = 0;

    constructor() {
        this.register = new Brancher(null, this);
    }
}

export class Brancher {
    public parent: Brancher;
    private readonly command: Command;

    constructor(parent: Brancher | null, command: Command) {
        this.command = command;
        this.parent = parent;
    }

    get with(): Register {
        this.command.indent++;
        return new Register(new Brancher(this, this.command), this.command);
    }

    get or(): Register {
        return new Register(this, this.command);
    }

    get end(): Brancher {
        this.command.indent--;
        return this.parent;
    }
}

export class Register {
    private readonly brancher: Brancher;
    private command: Command;

    constructor(brancher: Brancher, command: Command) {
        this.brancher = brancher;
        this.command = command;
    }

    number(): Brancher {
        return this.brancher;
    }

    literal(name: string): Brancher {
        this.command.tree += name;
        console.log(`${" ".repeat(this.command.indent)}${name}`);
        return this.brancher;
    }
}