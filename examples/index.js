const { Command, NumberType, WordType } = require("..");

class MyCommand extends Command {
	constructor() {
		super();
		this.register
			.with.arg("number", NumberType.number).run(w => console.log("number:", w))
			.or.literal("myliteral").run(w => console.log("literal:", w))
			.or.arg("string", WordType.word).run(w => console.log("word:", w));
	}

	print() {
		console.log(this.run("123"));
		// console.log(JSON.stringify(this.tree, null, 4));
	}
}

let a = new MyCommand();
a.print();