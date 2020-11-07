const { Command, NumberType, WordType } = require("..");

class MyCommand extends Command {
	constructor() {
		super();
		this.register
			.with.arg("number", NumberType.number).run(() => console.log("numbered!"))
			.or.literal("myliteral").run(() => console.log("hello world"))
			.or.arg("string", WordType.word).run(() => console.log("stringed!"));
	}

	print() {
		console.log(this.run("myliteral"));
		// console.log(JSON.stringify(this.tree, null, 4));
	}
}

let a = new MyCommand();
a.print();