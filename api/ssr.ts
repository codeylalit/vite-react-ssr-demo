import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = req.url || "/";
    const distDir = path.resolve(process.cwd(), "dist");
    const ssrEntry = path.resolve(process.cwd(), "dist-ssr", "entry-server.js");

    const { render } = await import(pathToFileURL(ssrEntry).href);
    let template = await fs.readFile(path.join(distDir, "index.html"), "utf-8");
    const { html: appHtml } = await render(url);

    template = template.replace("<!--app-html-->", appHtml);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(template);
  } catch (err) {
    console.error(err);
    res.status(500).send("SSR error");
  }
}
