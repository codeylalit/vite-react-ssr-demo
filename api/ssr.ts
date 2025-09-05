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

const ABORT_DELAY = 10000; // safety timeout

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const distDir  = path.resolve(process.cwd(), "dist");       // client build (index.html)
    const ssrEntry = path.resolve(process.cwd(), "dist-ssr", "entry-server.js");
    const template = await fs.readFile(path.join(distDir, "index.html"), "utf-8");
    const [head, tail] = template.split("<!--app-html-->");

    const { render } = await import(pathToFileURL(ssrEntry).href);

    let didError = false;

    res.setHeader("Content-Type", "text/html; charset=utf-8");

    const { pipe, abort } = render(req.url || "/", {
      onShellReady() {
        // Start streaming as soon as the shell is ready
        res.statusCode = didError ? 500 : 200;
        res.write(head);
        // pipe React stream directly into the response
        pipe(res);
      },
      onAllReady() {
        // Close out the HTML once all suspense boundaries are ready
        res.write(tail);
        res.end();
      },
      onShellError(err) {
        console.error("onShellError", err);
        res.statusCode = 500;
        res.end("An error occurred");
      },
      onError(err) {
        didError = true;
        console.error("SSR error", err);
      },
    });

    // abort if something blocks rendering (e.g., slow data)
    setTimeout(() => abort(), ABORT_DELAY);
  } catch (e) {
    console.error(e);
    res.status(500).send("SSR error");
  }
}
