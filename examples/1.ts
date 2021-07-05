import { p, parse } from "../src";

const input = `hello world`;

const parser = p.literal("hello").bind(p.string);

console.log(parse(input, parser));
