import { Type } from "./type";

export class UnquotedString implements Type {
	validate(word: string): boolean {
		return false;
	}
}