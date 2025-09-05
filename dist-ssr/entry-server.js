import { jsx, jsxs } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import React__default, { Suspense } from "react";
import { Link, Routes, Route } from "react-router-dom";
function About() {
  return /* @__PURE__ */ jsx("h1", { children: "About page rendered with SSR" });
}
const LandingPage = React__default.lazy(() => import("./assets/Index-CtT04lbA.js"));
function App() {
  return /* @__PURE__ */ jsxs("div", { style: { fontFamily: "system-ui, Arial, sans-serif", padding: 24 }, children: [
    /* @__PURE__ */ jsxs("nav", { style: { display: "flex", gap: 12, marginBottom: 16 }, children: [
      /* @__PURE__ */ jsx(Link, { to: "/", children: "Home" }),
      /* @__PURE__ */ jsx(Link, { to: "/about", children: "About" })
    ] }),
    /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { children: "Loading..." }), children: /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(LandingPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/about", element: /* @__PURE__ */ jsx(About, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx("div", { children: "Not Found" }) })
    ] }) })
  ] });
}
async function render(url) {
  const html = renderToString(
    /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(App, {}) })
  );
  return { html };
}
export {
  render
};
