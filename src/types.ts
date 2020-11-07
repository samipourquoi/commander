export interface Type<T> {
	validate: (word: string) => boolean;
	parse: (word: string) => T;
}

export class UnquotedStringType implements Type<string> {
	static unquotedString(): UnquotedStringType {
		return new UnquotedStringType();
	}

	validate(word: string): boolean {
		return true;
	}

	parse(word: string): string {
		return word;
	}
}

export class WordType implements Type<string> {
	static word(): WordType {
		return new WordType();
	}

	validate(word: string): boolean {
		return !!word.match(/^\w*$/);
	}

	parse(word: string): string {
		return word;
	}
}

export class NumberType implements Type<number> {
	static number(): NumberType {
		return new NumberType();
	}

	validate(word: string): boolean {
		return !!word.match(/^\d*$/);
	}

	parse(word: string): number {
		return +word;
	}
}
