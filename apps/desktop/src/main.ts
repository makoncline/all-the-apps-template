import { app, BrowserWindow } from "electron";

import { preloadPath, rendererUrl } from "./constants";

const createMainWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,
    backgroundColor: "#eef2eb",
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  await mainWindow.loadURL(rendererUrl);
};

app.whenReady().then(async () => {
  await createMainWindow();

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
