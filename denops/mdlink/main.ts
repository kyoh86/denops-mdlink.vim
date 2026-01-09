import type { Denops } from "@denops/std";
import * as fn from "@denops/std/function";
import { ensure, is } from "@core/unknownutil";
import { DOMParser } from "@b-fuze/deno-dom";

export function main(denops: Denops) {
  denops.dispatcher = {
    async paste_markdown_url() {
      try {
        const url = await readUrlFromClipboard(denops);
        const title = await fetchTitle(url);
        const markdown = title ? `[${title}](${url})` : url;
        await insertTextAtCursor(denops, markdown);
      } catch (err) {
        console.error(err);
      }
    },
  };
}

async function readUrlFromClipboard(denops: Denops): Promise<string> {
  const primary = ensure(await fn.getreg(denops, "*"), is.String).trim();
  if (primary) {
    return primary;
  }
  return ensure(await fn.getreg(denops, "+"), is.String).trim();
}

async function fetchTitle(url: string): Promise<string | null> {
  if (!/^https?:\/\//i.test(url)) {
    return null;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const title = doc?.querySelector("title")?.textContent?.trim();
    return title || null;
  } catch {
    return null;
  }
}

async function insertTextAtCursor(denops: Denops, text: string): Promise<void> {
  const [, lnum, col] = await fn.getcurpos(denops);
  const line = ensure(await fn.getline(denops, lnum), is.String);
  const head = ensure(await fn.strpart(denops, line, 0, col - 1), is.String);
  const tail = ensure(await fn.strpart(denops, line, col - 1), is.String);
  const newLine = `${head}${text}${tail}`;
  await fn.setline(denops, lnum, newLine);
  const textLen = ensure(await fn.strlen(denops, text), is.Number);
  await fn.cursor(denops, [lnum, col + textLen]);
}
