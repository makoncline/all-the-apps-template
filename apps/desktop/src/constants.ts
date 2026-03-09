import path from "node:path";

export const rendererUrl = process.env.ELECTRON_RENDERER_URL ?? "http://localhost:3000";
export const preloadPath = path.join(__dirname, "preload.js");
