const { Command, QuotedType, RestType } = require("..");

class SubCommand extends Command {
	constructor() {
		super();
		this.register
			.with.literal("sub").run(() => console.log("subcommands!"))
			.____.with.arg("<rest>", () => new RestType(QuotedType.quoted())).run(ctx => console.log(ctx));
	}
}

class MyCommand extends Command {
	constructor() {
		super();
		let sub = new SubCommand();

		this.register.with.literal("help", "h")
			.with.literal("fun").run(this.fun)
			.or.literal("games").run(this.games)
			.____.with.arg("<game name>", QuotedType.quoted).run(this.playGame)
			.____.end
			.or.literal("utility").run(this.utility)
			.or.attach(sub).end
			.end;
	}

	fun() {
		return { message: "fun commands" }
	}

	games() {
		return { message: "games commands" }
	}

	utility() {
		return { message: "utility commands" }
	}

	playGame(ctx) {
		return { message: "play game: " + ctx.arg }
	}
}

let a = new MyCommand();
try {
	let result = a.run(`help sub "hello world" "how are you"`);
	console.log(a.message);
} catch (e) {
	console.error(e);
}