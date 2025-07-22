export type FeedItem = {
  id       : number;
  sub_id  : number;
  title    : string;
  url      : string;
  pub_date?: string;
};

export type NewFeedItem = {
  id       : number;
  title    : string;
  url      : string;
  pub_date?: string;
};