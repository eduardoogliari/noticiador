// import { FeedItem } from './FeedItem';
import { FeedItem } from "./feed-item";
import { RefreshFeedResultsMap } from "./refresh-feed-result";
import { SubscriptionFilter } from "./subscription-filter";

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
            getFeedBinItems : () => FeedItem[];
            setInFeedBin    : (itemId : number, value : boolean) => void;
            deleteFeedItem : (itemId : number) => void;

            signalSubscriptionsChanged: () => void;
            onSubscriptionsChanged: (callback: () => void) => void;
        };

        electronApi: {
            openInExternalBrowser    : (url : string) => void;
            copyToClipboard          : (text : string) => void;
            setWebviewBounds         : (x : number, y : number, width : number, height : number) => void;
            setWebviewURL            : (url : string) => void;
            getWebviewURL            : () => string;
            openAddSubscriptionModal : () => void;
            closeAddSubscriptionModal: () => void;
            onClosePopups: ( callback: () => void ) => void;
        };

        webAPI: {
            onURLChanged: (callback: (url : string) => void) => void;
        };
    }
}


export {};