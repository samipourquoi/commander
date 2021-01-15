const { Command, QuotedType } = require("..");

class SubCommand extends Command {
	constructor() {
		super();
		this.register
			.with.literal("sub").run(() => console.log("subcommands!"))
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
	let { message } = a.run(`help games "The Legend of Zelda"`);
	console.log(message);
} catch (e) {
	console.error(e.toString());
}