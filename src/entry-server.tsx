// import React from "react";
// import { renderToString } from "react-dom/server";
// import { StaticRouter } from "react-router-dom/server";
// import App from "./App";

// export async function render(url: string) {
//   const html = renderToString(
//     <StaticRouter location={url}>
//       <App />
//     </StaticRouter>
//   );
//   return { html };
// }

// entry-server.js (or entry-server.ts)
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

export async function render(url) {
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );

  return { html }; // You must return html key
}