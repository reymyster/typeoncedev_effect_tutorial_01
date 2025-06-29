import { Console, Data, Effect, pipe } from "effect";

class FetchError extends Data.TaggedError("FetchError")<Readonly<{}>> {}

class JsonError extends Data.TaggedError("JsonError")<Readonly<{}>> {}

const fetchRequest = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co/api/v2/psadokemon/garchomp/"),
  catch: () => new FetchError(),
});

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: () => new JsonError(),
  });

const savePokemon = (pokemon: unknown) =>
  Effect.tryPromise(() =>
    fetch("/api/pokemon", { body: JSON.stringify(pokemon) })
  );

const main = fetchRequest.pipe(
  Effect.filterOrFail(
    (response) => response.ok,
    () => new FetchError()
  ),
  Effect.flatMap(jsonResponse),
  Effect.flatMap(savePokemon),
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error"),
    JsonError: () => Effect.succeed("Json error"),
    UnknownException: () => Effect.succeed("Unknown error"),
  }),
  Effect.tap(Console.log)
);

Effect.runPromise(main);
