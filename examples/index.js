const { Command, NumberType, QuotedType } = require("..");

class MyCommand extends Command {
	constructor() {
		super();
		this.register.with.literal("help")
			.with.literal("fun").run(this.fun)
			.or.literal("games").run(this.games)
			.or.literal("utility").run(this.utility);
	}

	fun() {
		return {
			message: "fun commands"
		}
	}

	games() {
		return {
			message: "games commands"
		}
	}

	utility() {
		return {
			message: "utility commands"
		}
	}
}

let a = new MyCommand();

try {
	let { message } = a.run("help utilitys");
	console.log(message);
} catch (e) {
	console.error(e.toString());
}