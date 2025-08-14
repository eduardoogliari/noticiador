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
  setRead : (itemId : number, value : boolean) => ipcRenderer.invoke( 'set-read', itemId, value ),
  getFeedBinItems : () => ipcRenderer.invoke('get-feed-bin-items'),
  setInFeedBin : (itemId : number, value : boolean) => ipcRenderer.invoke( 'set-in-feed-bin', itemId, value ),

});

contextBridge.exposeInMainWorld('electronApi', {
  openInExternalBrowser : (url : string) => ipcRenderer.invoke( 'open-external-browser', url ),
  copyToClipboard : (text : string) => ipcRenderer.invoke( 'copy-to-clipboard', text ),
  setWebviewBounds : (x : number, y : number, width : number, height : number) => ipcRenderer.send( 'set-webview-bounds', x, y, width, height ),
  setWebviewURL : (url : string) => ipcRenderer.send( 'set-webview-url', url ),
  getWebviewURL : () => ipcRenderer.invoke( 'get-webview-url' ),
});
