// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, IpcMainInvokeEvent, ipcRenderer } from "electron";
import { Subscription, NewSubscription } from "./types/subscription";

contextBridge.exposeInMainWorld('rssAPI', {
  findFeedURL     : (url : string) => ipcRenderer.invoke('find-feed-url', url),
  getFeedFavicon  : (url : string) => ipcRenderer.invoke('get-feed-favicon', url),
  getFeedTitle    : (url : string) => ipcRenderer.invoke('get-feed-title', url),
  refreshFeeds    : (subs : Subscription[]) => ipcRenderer.invoke('refresh-feeds', subs),
  getFeeds        : (subs : Subscription[]) => ipcRenderer.invoke( 'get-feeds', subs ),
  getSubscriptions: () => ipcRenderer.invoke( 'get-subscriptions' ),
  addSubscriptions: (newSubs: NewSubscription[]) => ipcRenderer.invoke( 'add-subscriptions', newSubs ),
  getFaviconData  : (subId : number) => ipcRenderer.invoke( 'get-favicon-data', subId ),
  setFavorite : (itemId : number, value : boolean) => ipcRenderer.invoke( 'set-favorite', itemId, value ),
  getFavorites : () => ipcRenderer.invoke('get-favorites'),
});