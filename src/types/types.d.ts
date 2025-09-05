import { FeedItem } from "./feed-item";
import { RefreshFeedResultsMap } from "./refresh-feed-result";
import { SubscriptionFilter } from "./subscription-filter";
import { ModalData } from "./modal-data";

declare global {
    interface Window {
        rssAPI: {
            findFeedURL     : (url : string) => Promise<string>,
            getFavicon  : (url : string) => Promise<Buffer | null>,
            getFeedTitle    : (url : string) => Promise<string>,
            refreshFeeds    : (subs : Subscription[]) => Promise<RefreshFeedResultsMap>;
            getFeeds        : (subs : Subscription[]) => FeedItem[];
            getSubscriptions: ( filter : SubscriptionFilter ) => Subscription[];
            addSubscriptions: (newSubs: NewSubscription[]) => void;
            deleteSubscriptions: ( subsToDelete: number[] ) => void;
            getFaviconData  : (subId : number) => Buffer | null;
            setFavorite     : (itemId : number, value : boolean) => void;
            getFavorites    : () => FeedItem[];
            setRead         : (itemId : number, value : boolean) => void;
            setReadMultiple : (itemIds : number[], value : boolean) => void;
            getFeedBinItems : () => FeedItem[];
            setInFeedBin    : (itemIds : number[], value : boolean) => void;
            deleteFeedItems : (itemIds : number[]) => void;

            signalSubscriptionsChanged: () => void;
            signalFeedBinChanged: () => void;
            onFeedBinChanged: (callback: () => void) => void;
            onSubscriptionsChanged: (callback: () => void) => void;
        };

        electronApi: {
            getStoreKey : (key : string) => Promise<unknown>;
            setStoreValue : ( key : string, value : unknown ) => void;

            openInExternalBrowser    : (url : string) => void;
            copyToClipboard          : (text : string) => void;

            setWebviewBounds         : (x : number, y : number, width : number, height : number) => void;
            setWebviewURL            : (url : string) => void;
            getWebviewURL            : () => string;

            openModal: (data : ModalData) => void;
            closeModal: () => void;
            onClosePopups: ( callback: () => void ) => void;
            onModalData: ( callback: (data : ModalData) => void ) => void;
        };

        webAPI: {
            onURLChanged: (callback: (url : string) => void) => void;
        };
    }
}


export {};