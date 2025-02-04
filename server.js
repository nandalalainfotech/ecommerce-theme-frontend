const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const apiPaths = {
  "/api": {
    target: "http://localhost:5000",
    pathRewrite: {
      "^/api": "/api",
    },
    changeOrigin: true,
  },
};
console.log("Port------>>>", port);
const isDevelopment = process.env.NODE_ENV !== "production";

app
  .prepare()
  .then(() => {
    const server = express();
    console.log("isDevelopment------>>>", isDevelopment);
    if (isDevelopment) {
      server.use("/api", createProxyMiddleware(apiPaths["/api"]));
    } else {
      server.use("/api", createProxyMiddleware(apiPaths["/api"]));
    }

    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("Error:::::", err);
  });
