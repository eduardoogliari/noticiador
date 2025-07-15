import { FeedItem } from './FeedItem';

declare global {
  interface Window {
    rssAPI: {
      getFeed: (subs : Subscription[]) => Promise<FeedItem[]>;
      getSubscriptions: () => Subscription[];
    };
  }
}

export {};