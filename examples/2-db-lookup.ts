import { p, parse, Parser } from "../src";
import { literal } from "../src/combinators";

interface Anime {
  id: number,
  name: string
}

const db: Anime[] = [
  { id: 0, name: "Dragon Ball" },
  { id: 1, name: "One Piece" },
  { id: 2, name: "Naruto" },
  { id: 3, name: "Tokyo Ghoul" },
  { id: 4, name: "Death Note" }
];

const animeParser = p.string.bind(name => {
  const lookup = db.find(anime => anime.name == name)
  return lookup ?
    Parser.pure(lookup) :
    Parser.fail<Anime>();
});

const command = literal("info").bind(animeParser);

const correct = `info "One Piece"`;
const incorrect = `info "Bing bong dong"`

console.log(parse(correct, command));   // matches
console.log(parse(incorrect, command)); // fails
