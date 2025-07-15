// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, IpcMainInvokeEvent, ipcRenderer } from "electron";
import { Subscription } from "./types/Subscription";

contextBridge.exposeInMainWorld('rssAPI', {
  getFeed: (subs : Subscription[]) => ipcRenderer.invoke('get-rss-feed', subs),
  getSubscriptions: () => ipcRenderer.invoke( 'get-subscriptions' ),
});
