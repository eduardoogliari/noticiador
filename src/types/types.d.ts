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
    };
  }
}


export {};