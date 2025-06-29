import { Context, Effect, Config, Layer } from "effect";

export class PokeApiUrl extends Context.Tag("PokeApiUrl")<
  PokeApiUrl,
  // 👇 Even a single `string` works
  string
>() {
  static readonly Live = Layer.effect(
    this,
    Effect.gen(function* () {
      const baseUrl = yield* Config.string("BASE_URL");
      return `${baseUrl}/api/v2/pokemon`;
    })
  );
}
