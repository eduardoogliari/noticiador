export type RefreshFeedResult = {
    success     : boolean;
    errorMessage: string;
};

// Key: Subscription ID      Value: Feed fetch result
export type RefreshFeedResultsMap = Record<number, RefreshFeedResult>;