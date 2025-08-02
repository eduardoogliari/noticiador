export type FeedItem = {
  id       : number;
  sub_id  : number;
  title    : string;
  url      : string;
  pub_date?: string;
  is_favorite : boolean;
  is_read : boolean;
  pending_removal : boolean;
};

export type NewFeedItem = {
  id       : number;
  title    : string;
  url      : string;
  pub_date?: string;
};