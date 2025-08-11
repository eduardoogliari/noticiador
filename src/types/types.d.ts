// import { FeedItem } from './FeedItem';
import { FeedItem } from "./feed-item";
import { RefreshFeedResultsMap } from "./refresh-feed-result";

declare global {
  interface Window {
    rssAPI: {
        findFeedURL     : (url : string) => Promise<string>,
        getFeedFavicon  : (url : string) => Promise<Buffer | null>,
        getFeedTitle    : (url : string) => Promise<string>,
        refreshFeeds    : (subs : Subscription[]) => Promise<RefreshFeedResultsMap>;
        getFeeds        : (subs : Subscription[]) => FeedItem[];
        getSubscriptions: () => Subscription[];
        addSubscriptions: (newSubs: NewSubscription[]) => void;
        getFaviconData  : (subId : number) => Buffer | null;
        setFavorite : (itemId : number, value : boolean) => void;
        getFavorites : () => FeedItem[];
        setRead : (itemId : number, value : boolean) => void;
        getFeedBinItems : () => FeedItem[];
        setInFeedBin : (itemId : number, value : boolean) => void;
        openInExternalBrowser : (url : string) => void;
        copyToClipboard : (text : string) => void;
    };
  }
}


export {};