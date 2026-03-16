import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distRoot = path.resolve(__dirname, "..", "dist");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 8080);

const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".ttf", "font/ttf"],
]);

const safeJoin = (root, pathname) => {
  const cleanPath = pathname.replace(/^\/+/, "");
  const resolved = path.resolve(root, cleanPath);

  if (!resolved.startsWith(root)) {
    throw new Error("Invalid path");
  }

  return resolved;
};

const fileExists = async (targetPath) => {
  try {
    const stats = await fs.stat(targetPath);
    return stats.isFile();
  } catch {
    return false;
  }
};

const resolveRequestPath = async (pathname) => {
  const normalizedPath = decodeURIComponent(pathname || "/");
  const trimmedPath = normalizedPath.replace(/\/+$/, "") || "/";

  const directFile = safeJoin(distRoot, trimmedPath);
  if (await fileExists(directFile)) {
    return directFile;
  }

  const nestedIndex = safeJoin(distRoot, path.join(trimmedPath, "index.html"));
  if (await fileExists(nestedIndex)) {
    return nestedIndex;
  }

  if (!path.extname(trimmedPath)) {
    const htmlFile = safeJoin(distRoot, `${trimmedPath.replace(/^\/+/, "")}.html`);
    if (await fileExists(htmlFile)) {
      return htmlFile;
    }
  }

  return safeJoin(distRoot, "404.html");
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || `${host}:${port}`}`);
    const filePath = await resolveRequestPath(url.pathname);
    const ext = path.extname(filePath);
    const isNotFound = filePath.endsWith(`${path.sep}404.html`);
    const content = await fs.readFile(filePath);

    res.writeHead(isNotFound ? 404 : 200, {
      "Content-Type": contentTypes.get(ext) || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
    });
    res.end(content);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(error instanceof Error ? error.message : "SEO preview server error");
  }
});

server.listen(port, host, () => {
  console.log(`SEO preview running at http://${host}:${port}`);
});
