const Commander = require("..");

class MyCommand extends Commander.Command {
	constructor() {
		super();
		this.register
			.with.literal("help")
				.with.literal("discord").run(() => console.log("discord!"))
				.or.literal("server")
				.end
			.or.literal("bonk").run(() => console.log("*hello world*"))
				.with.literal("2")
					.with.literal("3")
						.with.literal("4").run(() => console.log("*it's a 4*"))
						.or.literal("still there").run(() => console.log("*no*"))
						.end
					.end
				.end
			.or.literal("world")
		.end;
	}

	print() {
		console.log(this.run("help discord"));
		// console.log(JSON.stringify(this.tree, null, 4));
	}
}

let a = new MyCommand();
a.print();