export interface Type<T> {
	validate: (word: string, words?: string[]) => boolean;
	parse: (word: string, words: string[]) => T;
}

export class UnquotedStringType implements Type<string> {
	static unquotedString(): UnquotedStringType {
		return new UnquotedStringType();
	}

	validate(word: string): boolean {
		return true;
	}

	parse(word: string, words: string[]): string {
		words.shift();
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

	parse(word: string, words: string[]): string {
		words.shift();
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

	parse(word: string, words: string[]): number {
		words.shift();
		return +word;
	}
}

export class QuotedType implements Type<string> {
	static quoted(): QuotedType {
		return new QuotedType();
	}

	validate(word: string, words?: string[]): boolean {
		if (!words) words = []; // just in case...
		if (word.startsWith("\"")) {
			let current: string | undefined = word.slice(1);
			do {
				current = words.shift();
				if (!current) return false;
			} while (!current.endsWith("\""));
		}
		return true;
	}

	parse(word: string, words: string[]): string {
		let parsed: string[] = [];

		if (word.startsWith("\"") && word.endsWith("\"")) {
			return words.shift()!.slice(1, word.length-1);
		}

		if (word.startsWith("\"")) {
			let current: string | undefined = words.shift()!.slice(1);
			do {
				parsed.push(current);
				current = words.shift();
				if (!current) throw new Error("this shouldn't get thrown");
			} while (!current.endsWith("\""));
			parsed.push(current!.slice(0, current!.length-1));
		} else {
			return words.shift()!;
		}
		return parsed.join(" ");
	}
}

export class RestType implements Type<unknown> {
	private type: Type<unknown>;

	constructor(type: Type<unknown>) {
		this.type = type;
	}

	parse(word: string, words: string[]): unknown[] {
		let parsed: unknown[] = [];
		while (words.length > 0) {
			let value = this.type.parse(words[0], words);
			parsed.push(value);
		}
		return parsed;
	}

	validate(): boolean {
		return true;
	}

}