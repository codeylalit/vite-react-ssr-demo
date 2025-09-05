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

import React from "react";
import App from "./App";
import { renderToPipeableStream } from "react-dom/server";

// If you use React Router, wrap <App> with a memory router here.

export function renderStream() {
  // Return a pipe/abort pair the handler can use
  return renderToPipeableStream(<App />, {
    onError(err) {
      console.error("SSR error:", err);
    },
  });
}
