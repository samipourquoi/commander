# Commander
[![NPM](https://nodei.co/npm/@samipourquoi/commander.png)](https://www.npmjs.com/package/@samipourquoi/commander)

Commander helps you build, dispatch and run commands.

Consider the following commands, each having their 'own things':
- `cmd foo`
- `cmd foo <number>`
- `cmd fubar`

```javascript
const { Command, NumberType } = require("@samipourquoi/commander");

class MyCommand extends Command {
	constructor() {
		super();
		this.register.with.literal("cmd")
            .with.literal("foo").run(() => console.log("it's a foo!"))
            .____.doc({ description: "It's my foo command!" })
            .____.with.arg("number", NumberType.number).run(w => {
            	console.log("it's a value of " + w + "!")
            }).end
            .or.literal("fubar").run(() => console.log("it's a fubar!"));
	}
}

let cmd = new MyCommand();
cmd.run("cmd foo 4"); // "it's a value of 4!"
cmd.run("cmd fubar"); // "it's a fubar!"
cmd.run("cmd blabla"); // throws an error: "Unable to find command"
```

# Features

### TypeScript compatible
This library is written in TypeScript, which makes it usable in both the TS and JS world!

### Types
Through types, you can add arguments to your commands!
As shown in the example, use the `.arg()` method to register a typed argument.
The in-built types are:
- `NumberType.number`: any kind of number;
- `UnquotedType.unquoted`: a string without any quotes;
- `QuotedType.quoted`: a string surrounded with quotes, allowing spaces in it;
- `WordType.word`: a single-worded string composed of the letters of the english alphabet, underscores `_` and numbers.

### Readable Syntax
The syntax is concise and readable, making the command easy to maintain without having to write dozens of 
lines every time.

### Add documentation
You can easily add documentation to any of your command, at any node (= argument).

# Syntax
In Commandier, there are three objects which work together to build commands:
- `Command`: the base class of the command;
- `Brancher`: a class which represents a 'node', where the command can split into two branches;
- `Register`: a class with which you will add an argument.

### Branching
From a `Brancher`, `.with` will allow you to register from the above node new arguments. 
We will refer to that as being 'branching'.
```javascript
this.register.with.literal("help");
```
`.or` gets used after having branched. It allows you to add arguments to the node.
```javascript
this.register
    .with.literal("help")
    .or.literal("help2");
```
If you have branched twice in a command (a node within another node), use `.end` to 'go back' to the parent node.
```javascript
this.register
    .with.literal("help")
    .____.with.literal("inside")
    .____.or.literal("inside2").end
    .or.literal("help2");
```

**Note: `.____` is a property of a `Brancher` which allows you to indent, 
but which does not mess up with Linters, etc. It does not do anything.**

### Registering
`.with` and `.or` return a `Register`. From that class, as shown above, you can register arguments with:
- `.literal(...words: string[])` which registers one (or more) plain text words as constants;
- `.arg(name: string, type: Type<unknown>)` which registers an named argument from a specified type. cf. above section.

They both return a `Brancher`.

### Running
From a `Brancher`, use `.run(n: any, o: any[])` with a function as a parameter. `n` being the node's parsed argument
and `o` an array of all the other parsed arguments. That function will get executed when it runs
the command, and it arrives at the latest registered argument's node.
**Careful! if the command is run with invalid arguments, it will throw an error.** 
Make sure to surround the `Command.run()` with a try...catch statement.
```javascript
// in the constructor
this.register
    .with.literal("help").run(() => console.log("help!"))
    .____.with.literal("inside").run(() => console.log("input must be 'help inside'!"))
    .____.or.arg("number", NumberType.number).run((n, o) => {
    	console.log(n, o);
    })
    .____.or.literal("inside2").end
    .or.literal("help2");

// somewhere else
try {
    command.run("help inside2"); // "input must be 'help inside'!"
    command.run("help inside3"); // throws an error
    command.run("help 3"); // 3, ['help', 3]
} catch (e) {
    console.error(e);
}
```

It is possible to return from one `.run()` to the final `command.run("<input>")` call. 
This is encouraged as it allows easier testing.
```javascript
// in the constructor
this.register
    .with.literal("help").run(() => console.log("help!"))
    .____.with.literal("inside").run(() => "input must be 'help inside'!")
    .____.or.literal("inside2").end
    .or.literal("help2");

// somewhere else
try {
    let msg = command.run("help inside2");
    console.log(msg); // "input must be 'help inside'!"
} catch (e) {
    console.error(e);
}
```

### Documenting
You can easily document what a specific node does using `.doc()` on a `Brancher`.
```javascript
this.register
    .with.literal("help").run(() => console.log("help!"))
    .____.doc({ description: "Sens help about something, hopefully.", author: "samipourquoi" })
    .____.with.literal("inside").run(() => console.log("input must be 'help inside'!"))
    .____.or.literal("inside2").end
    .or.literal("help2");
```

# Credits
Inspired somewhat by [Brigadier](https://github.com/Mojang/brigadier).
Feel free to contact be on Discord `samipourquoi#9267` or create an issue for any help.