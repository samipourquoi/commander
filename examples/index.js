const Commander = require("..");

class MyCommand extends Commander.Command {
	constructor() {
		super();
		this.register
			.with.literal("help")
				.with.literal("discord")
				.or.literal("server")
				.end
			.or.literal("bonk")
				.with.literal("2")
					.with.literal("3")
						.with.literal("4")
						.or.literal("still there")
						.end
					.end
				.end
			.or.literal("world")
		.end;
	}

	print() {
		console.log(this);
	}
}

let a = new MyCommand();
// a.print();