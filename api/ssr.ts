// import type { VercelRequest, VercelResponse } from "@vercel/node";
// import fs from "node:fs/promises";
// import path from "node:path";
// import { pathToFileURL } from "node:url";

// export default async function handler(req: VercelRequest, res: VercelResponse) {
//   try {
//     const url = req.url || "/";
//     const distDir = path.resolve(process.cwd(), "dist");
//     const ssrEntry = path.resolve(process.cwd(), "dist-ssr", "entry-server.js");

//     const { render } = await import(pathToFileURL(ssrEntry).href);
//     let template = await fs.readFile(path.join(distDir, "index.html"), "utf-8");
//     const { html: appHtml } = await render(url);

//     template = template.replace("<!--app-html-->", appHtml);

//     res.setHeader("Content-Type", "text/html; charset=utf-8");
//     res.status(200).send(template);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("SSR error");
//   }
// }
import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const distDir  = path.resolve(process.cwd(), "dist");              // client build (index.html)
    const ssrEntry = path.resolve(process.cwd(), "dist-ssr", "entry-server.js");

    // 1) read template once per request (or cache it)
    const template = await fs.readFile(path.join(distDir, "index.html"), "utf-8");
    const [head, tail] = template.split("<!--app-html-->");

    // 2) import server bundle (ESM)
    const { renderStream } = await import(pathToFileURL(ssrEntry).href);

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");

    // 3) write head part before stream
    res.write(head);

    let didError = false;
    const { pipe, abort } = renderStream();

    // 4) pipe React stream, then close with tail
    pipe({
      write: (chunk: any) => res.write(chunk),
      end: () => {
        res.write(tail);
        res.end();
      },
      on: () => {}, // minimal Writable shim for pipe()
    } as any);

    // 5) timeout safety
    setTimeout(() => {
      if (!res.writableEnded) {
        didError = true;
        abort();
        res.statusCode = 500;
        res.end("<!-- SSR aborted -->");
      }
    }, 10000);
  } catch (err) {
    console.error(err);
    res.status(500).send("SSR error");
  }
}
