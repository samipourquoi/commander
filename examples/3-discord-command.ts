import * as p from "../src";

const inventory = p.literal("game").bind(
  p.union(
    p.literal("global").bind(
      p.string.bind(character =>
        p.union(
          p.literal("info").bind(
            p.run(() => {
              console.log("global info", character)
            })
          ),
          p.run(() => {
            console.log("global", character);
          })
        )
      )
    ),
    p.literal("local").bind(
      p.string.bind(character =>
        p.run(() => {
          console.log("local", character)
        })
      )
    )
  )
);
const input = `inventory global "Son Goku" info aaaa`
const result = p.parse(input, inventory);
result[0]?.[0]()
