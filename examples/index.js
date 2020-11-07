const { Command, NumberType, QuotedType } = require("..");

class MyCommand extends Command {
	constructor() {
		super();
		this.register
			.with.arg("number", NumberType.number).run(w => console.log("number:", w))
			.or.literal("myliteral").run(w => console.log("literal:", w))
			.or.arg("string", QuotedType.quoted).run(w => console.log("word:", w))
				.with.arg("othernumber", NumberType.number).run(console.log)
				.doc({
					description: "A number which will do something (hopefully)",
					usage: "123",
					author: "samipourquoi"
				});
	}

	print() {
		console.log(this.run(`"hello world"`));
		// console.log(this.run(`123`));
		// console.log(JSON.stringify(this.tree, null, 4));
	}
}

let a = new MyCommand();
a.print();