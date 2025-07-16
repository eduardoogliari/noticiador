// import { FeedItem } from './FeedItem';
import { FeedItem } from "./FeedItem";
import { RefreshFeedResultsMap } from "./RefreshFeedResult";

declare global {
  interface Window {
    rssAPI: {
      refreshFeeds: (subs : Subscription[]) => Promise<RefreshFeedResultsMap>;
      getFeeds: (subs : Subscription[]) => FeedItem[];
      getSubscriptions: () => Subscription[];
    };
  }
}

export {};