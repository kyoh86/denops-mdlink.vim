import type { Denops } from "@denops/std";
import { as, ensure, is } from "@core/unknownutil";

export function main(denops: Denops) {
  denops.dispatcher = {
    foo(uFoo: unknown, uBar: unknown, uBaz: unknown) {
      try {
        const foo = ensure(uFoo, is.String);
        const bar = ensure(uBar, is.Record);
        const baz = ensure(uBaz, as.Optional(is.String));
        console.log(foo, bar, baz);
      } catch (err) {
        console.error(err);
      }
    },
  };
}
