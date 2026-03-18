import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

if (process.env.NODE_ENV === "development") {
  app.use(
    createProxyMiddleware({
      target: `http://localhost:${process.env.VITE_PORT || 5001}`,
      changeOrigin: true,
      ws: true,
    })
  );
} else {
  const publicDir = path.resolve(import.meta.dirname, "../../password-generator/dist/public");
  app.use(express.static(publicDir));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(publicDir, "index.html"));
  });
}

export default app;
