// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, IpcMainInvokeEvent, ipcRenderer } from "electron";
import { Subscription, NewSubscription } from "./types/subscription";
import { SubscriptionFilter } from "./types/subscription-filter";
import { ModalData } from "./types/modal-data";

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
  setReadMultiple : (itemIds : number[], value : boolean) => ipcRenderer.invoke( 'set-read-multiple', itemIds, value ),
  getFeedBinItems : () => ipcRenderer.invoke('get-feed-bin-items'),
  setInFeedBin    : (itemIds : number[], value : boolean) => ipcRenderer.invoke( 'set-in-feed-bin', itemIds, value ),
  deleteFeedItems : (itemIds : number[]) => ipcRenderer.invoke( 'delete-feed-items', itemIds ),

  signalFeedBinChanged: () => ipcRenderer.send('feed-bin-changed'),
  signalSubscriptionsChanged: () => ipcRenderer.send('subscriptions-changed'),
  onFeedBinChanged: (callback: () => void) => { ipcRenderer.on("feed-bin-changed", callback); },
  onSubscriptionsChanged: (callback: () => void) => { ipcRenderer.on("subscriptions-changed", callback); },
});

contextBridge.exposeInMainWorld('electronApi', {
    getStoreKey : (key : string) => ipcRenderer.invoke( 'store-get', key ),
    setStoreValue : ( key : string, value : unknown ) => ipcRenderer.invoke( 'store-set', key, value ),

  openInExternalBrowser    : (url : string) => ipcRenderer.invoke( 'open-external-browser', url ),
  copyToClipboard          : (text : string) => ipcRenderer.invoke( 'copy-to-clipboard', text ),
  setWebviewBounds         : (x : number, y : number, width : number, height : number) => ipcRenderer.send( 'set-webview-bounds', x, y, width, height ),
  setWebviewURL            : (url : string) => ipcRenderer.send( 'set-webview-url', url ),
  getWebviewURL            : () => ipcRenderer.invoke( 'get-webview-url' ),
  openModal : ( data : ModalData ) => ipcRenderer.send( 'open-modal', data ),
  closeModal : () => ipcRenderer.send( 'close-modal'),
  onClosePopups: ( callback: () => void ) => { ipcRenderer.on( 'close-popups', callback ); return () => ipcRenderer.removeListener( 'close-popups', callback ); },

  onModalData: ( callback: (data : ModalData) => void ) => ipcRenderer.on( 'modal-data', (_, data) => callback(data) ),
});

contextBridge.exposeInMainWorld('webAPI', {
    onURLChanged: (callback: (url : string) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, url: string) => { callback(url); };
      ipcRenderer.on("on-url-changed", handler);
      return () => { ipcRenderer.removeListener("on-url-changed", handler); };
    },
});