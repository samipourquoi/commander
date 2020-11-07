export interface Type<T> {
	validate: (word: string, consumer?: string[]) => boolean;
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

export class QuotedType implements Type<string> {
	static quoted(): QuotedType {
		return new QuotedType();
	}

	validate(word: string, consumer?: string[]): boolean {
		if (!consumer) consumer = []; // just in case...
		if (word.startsWith("\"") || word.startsWith("'")) {
			let current: string | undefined;
			console.log(word);
			do {
				current = consumer.shift();
				if (!current) return false;
			} while (!((current as string).endsWith("\"") || (current as string).endsWith("'")));
			return true;
		} else {
			return false;
		}
	}

	parse(word: string): string {
		return word;
	}
}

