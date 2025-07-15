export type Subscription = {
    id           : number;
    name         : string;
    url          : string;
    last_updated?: number;
};

export type NewSubscription = {
  name         : string;
  url           : string;
  last_updated?: string;
};