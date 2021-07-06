import * as p from "../src";

const input = `hello world`;

const command = p.literal("hello").bind(p.string);

console.log(p.parse(input, command));
