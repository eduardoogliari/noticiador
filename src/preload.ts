// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, IpcMainInvokeEvent, ipcRenderer } from "electron";
import { Subscription, NewSubscription } from "./types/subscription";
import { SubscriptionFilter } from "./types/subscription-filter";

contextBridge.exposeInMainWorld('rssAPI', {
  findFeedURL     : (url : string) => ipcRenderer.invoke('find-feed-url', url),
  getFavicon  : (url : string) => ipcRenderer.invoke('get-favicon', url),
  getFeedTitle    : (url : string) => ipcRenderer.invoke('get-feed-title', url),
  refreshFeeds    : (subs : Subscription[]) => ipcRenderer.invoke('refresh-feeds', subs),
  getFeeds        : (subs : Subscription[]) => ipcRenderer.invoke( 'get-feeds', subs ),
  getSubscriptions: ( filter : SubscriptionFilter ) => ipcRenderer.invoke( 'get-subscriptions', filter ),
  addSubscriptions: (newSubs: NewSubscription[]) => ipcRenderer.invoke( 'add-subscriptions', newSubs ),
  deleteSubscriptions: ( subsToDelete: number[] ) => ipcRenderer.invoke( 'delete-subscriptions', subsToDelete ),
  getFaviconData  : (subId : number) => ipcRenderer.invoke( 'get-favicon-data', subId ),
  setFavorite     : (itemId : number, value : boolean) => ipcRenderer.invoke( 'set-favorite', itemId, value ),
  getFavorites    : () => ipcRenderer.invoke('get-favorites'),
  setRead         : (itemId : number, value : boolean) => ipcRenderer.invoke( 'set-read', itemId, value ),
  getFeedBinItems : () => ipcRenderer.invoke('get-feed-bin-items'),
  setInFeedBin    : (itemId : number, value : boolean) => ipcRenderer.invoke( 'set-in-feed-bin', itemId, value ),

  signalSubscriptionsChanged: () => ipcRenderer.send('subscriptions-changed'),
  onSubscriptionsChanged: (callback: () => void) => { ipcRenderer.on("subscriptions-changed", callback); },
});

contextBridge.exposeInMainWorld('electronApi', {
  openInExternalBrowser    : (url : string) => ipcRenderer.invoke( 'open-external-browser', url ),
  copyToClipboard          : (text : string) => ipcRenderer.invoke( 'copy-to-clipboard', text ),
  setWebviewBounds         : (x : number, y : number, width : number, height : number) => ipcRenderer.send( 'set-webview-bounds', x, y, width, height ),
  setWebviewURL            : (url : string) => ipcRenderer.send( 'set-webview-url', url ),
  getWebviewURL            : () => ipcRenderer.invoke( 'get-webview-url' ),
  openAddSubscriptionModal : () => ipcRenderer.send( 'open-add-subscription-modal' ),
  closeAddSubscriptionModal: () => ipcRenderer.send( 'close-add-subscription-modal' ),
  onClosePopups: ( callback: () => void ) => { ipcRenderer.on( 'close-popups', callback ); return () => ipcRenderer.removeListener( 'close-popups', callback ); },
});

contextBridge.exposeInMainWorld('webAPI', {
    onURLChanged: (callback: (url : string) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, url: string) => { callback(url); };
      ipcRenderer.on("on-url-changed", handler);
      return () => { ipcRenderer.removeListener("on-url-changed", handler); };
    },
});