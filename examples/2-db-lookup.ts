import * as p from "../src";

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
    p.Parser.pure(lookup) :
    p.Parser.fail<Anime>();
});

const command = p.literal("info").bind(animeParser);

const correct = `info "One Piece"`;
const incorrect = `info "Bing bong dong"`

console.log(p.parse(correct, command));   // matches
console.log(p.parse(incorrect, command)); // fails
