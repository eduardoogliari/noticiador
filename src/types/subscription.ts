export type Subscription = {
    id           : number;
    name         : string;
    url          : string;
    category_id ?: number;
    last_updated?: number;
    favicon     ?: Buffer;
};

export type NewSubscription = {
  name         : string;
  url          : string;
  category_id ?: number;
  last_updated?: string;
  favicon     ?: Buffer;
};