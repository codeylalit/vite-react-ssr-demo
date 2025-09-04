import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const el = document.getElementById("root")!;
const tree = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

if (el.hasChildNodes()) {
  hydrateRoot(el, tree);
} else {
  createRoot(el).render(tree);
}
