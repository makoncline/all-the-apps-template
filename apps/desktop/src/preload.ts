import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("helloDesktop", {
  platform: process.platform
});
