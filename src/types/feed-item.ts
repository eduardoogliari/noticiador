export type FeedItem = {
  id              : number;
  sub_id          : number;
  title           : string;
  url             : string;
  comments_url   ?: string;
  pub_date       ?: string;
  is_favorite     : boolean;
  is_read         : boolean;
  in_feed_bin     : boolean;
};

export type NewFeedItem = {
  id           : number;
  title        : string;
  url          : string;
  comments_url?: string;
  pub_date    ?: string;
};