export type Subscription = {
    id           : number;
    name         : string;
    url          : string;
    last_updated?: number;
    favicon     ?: Buffer;
};

export type NewSubscription = {
  name         : string;
  url          : string;
  last_updated?: string;
  favicon     ?: Buffer;
};