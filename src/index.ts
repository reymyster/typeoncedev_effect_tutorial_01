import { Effect } from "effect";
import { PokeApi } from "./PokeApi";

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;
  return yield* pokeApi.getPokemon;
});
const runnable = program.pipe(Effect.provideService(PokeApi, PokeApi.Live));

// Error handling
const main = runnable.pipe(
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error"),
    JsonError: () => Effect.succeed("Json error"),
    ParseError: () => Effect.succeed("Parse error"),
  })
);

// Running effect
Effect.runPromise(main).then(console.log);
