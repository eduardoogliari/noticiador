import { FeedItem } from './FeedItem';

declare global {
  interface Window {
    rssAPI: {
      getFeed: () => Promise<FeedItem[]>;
    };
  }
}

export {};