import { Subscription } from "../types/subscription";
import SubscriptionListItem from "./SubscriptionListItem";
import styles from './SubscriptionList.module.css';

export type SubscriptionsListProp = {
    subscriptions : Subscription[];
    faviconCache : Record<number, string>;
    selectedSubscriptionId : number;
    selectedSubscriptionOptionsId : number;
    onClickSubTitle : (subId : number) => void;
    onClickSubOptions : (subId : number, event: React.MouseEvent) => void;
    onCloseSubOptions : () => void;
    subscriptionsBeingRefreshed: Set<number>;
    subscriptionUnreadCount :  Record<number, number>;
    subscriptionFeedCount : Record<number, number>;
};

export default function SubscriptionsList( props : SubscriptionsListProp ) {
    return (
        <ul className={styles["subscription-list"]}>
            {
                props.subscriptions.map( (item) => {
                    return (
                        <SubscriptionListItem
                            faviconCache={props.faviconCache}
                            id={item.id}
                            name={item.name}
                            onClickSubOptions={props.onClickSubOptions}
                            onClickSubTitle={props.onClickSubTitle}
                            onCloseSubOptions={props.onCloseSubOptions}
                            selectedSubscriptionId={props.selectedSubscriptionId}
                            selectedSubscriptionOptionsId={props.selectedSubscriptionOptionsId}
                            key={item.id}
                            subscriptionsBeingRefreshed={props.subscriptionsBeingRefreshed}
                            unreadFeedsCount={props.subscriptionUnreadCount[item.id] ?? 0}
                            feedCount={props.subscriptionFeedCount[item.id] ?? 0}
                        ></SubscriptionListItem>
                    );
                })
            }
        </ul>
    );
}