import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { setupSwagger } from "./lib/swagger.js";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
setupSwagger(app);

// Development: proxy to frontend dev server
if (process.env.NODE_ENV === "development") {
  app.use(
    createProxyMiddleware({
      target: `http://localhost:${process.env.VITE_PORT || 5001}`,
      changeOrigin: true,
      ws: true,
    })
  );
}

export default app;
