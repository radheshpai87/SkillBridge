import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
import logger from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

export async function setupVite(app, server) {
  // Get the project root (two levels up from server/lib/)
  const projectRoot = path.resolve(__dirname, "..", "..");
  const viteConfigPath = path.resolve(projectRoot, "vite.config.js");
  
  // Dynamically import the vite config
  const { default: viteConfig } = await import(viteConfigPath);
  
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const projectRoot = path.resolve(__dirname, "..", "..");
      const clientTemplate = path.resolve(projectRoot, "client", "index.html");

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.jsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

export function serveStatic(app) {
  // The client build is placed into <project-root>/dist/public by the repo's Vite config.
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const projectRoot = path.resolve(__dirname, "..", "..");
  const distPath = path.resolve(projectRoot, "dist", "public");

  if (!fs.existsSync(distPath)) {
    const errorMsg = `Could not find the build directory: ${distPath}, make sure to run the client build (vite build) first`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  logger.info(`Serving static files from: ${distPath}`);
  app.use(express.static(distPath));

  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
