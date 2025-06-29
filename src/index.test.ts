import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "../test/node";
import { it, expect } from "vitest";

import { Effect, Layer, ConfigProvider } from "effect";
import { PokeApi } from "./PokeApi";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const TestConfigProvider = ConfigProvider.fromMap(
  new Map([["BASE_URL", "http://localhost:3000"]])
);

const ConfigProviderLayer = Layer.setConfigProvider(TestConfigProvider);
const MainLayer = PokeApi.Default.pipe(Layer.provide(ConfigProviderLayer));

const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi;
  return yield* pokeApi.getPokemon;
});

// 👇 Provide the `PokeApi` live implementation to test
const main = program.pipe(Effect.provide(MainLayer));

it("returns a valid pokemon", async () => {
  const response = await Effect.runPromise(main);
  expect(response).toEqual({
    id: 1,
    height: 10,
    weight: 10,
    order: 1,
    name: "myname",
  });
});
