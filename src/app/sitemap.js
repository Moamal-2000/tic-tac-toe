import { BASE_URL } from "@/data/env";
import { readdirSync } from "fs";
import path from "path";

export const revalidate = 3600;

const baseDir = "src/app";
const excludeDirs = ["api", "fonts"];

export default function sitemap() {
  return getRoutes();
}

async function getRoutes() {
  const fullPath = path.join(process.cwd(), baseDir);
  const entries = readdirSync(fullPath, { withFileTypes: true });
  const routes = ["/"];

  entries.forEach((entry) => {
    const isValidRoute =
      entry.isDirectory() && !excludeDirs.includes(entry.name);
    if (isValidRoute) routes.push(`/${entry.name}`);
  });

  const sitemap = routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));

  return sitemap;
}
