import { p, parse } from "../src";

const input = `hello world`;

const command = p.literal("hello").bind(p.string);

console.log(parse(input, command));
