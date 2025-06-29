import { Context, Effect, Layer } from "effect";
import { PokeApiUrl } from "./PokeApiUrl";

export class BuildPokeApiUrl extends Context.Tag("BuildPokeApiUrl")<
  BuildPokeApiUrl,
  /// 👇 A single function
  (props: { name: string }) => string
>() {
  static readonly Live = Layer.effect(
    this,
    Effect.gen(function* () {
      const pokeApiUrl = yield* PokeApiUrl;
      return ({ name }) => `${pokeApiUrl}/${name}`;
    })
  ).pipe(
    // `provide` dependency layers directly inside `Live`
    Layer.provide(PokeApiUrl.Live)
  );
}
