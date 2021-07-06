import * as p from "../src";

function anime(ctx: p.Context) {
  ctx.argument(p.string, $anime);

  function $anime(anime: string) {
    ctx.run(() => console.log(anime));
  }
}

const cmd = p.command(anime);
const input = `anime "Dragon Ball"`;
const result = (p.parse(input, cmd)[0]?.[0] || (() => console.log("error"))) as () => void;
result()
