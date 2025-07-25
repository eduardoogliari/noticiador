import { Subscription } from "../types/subscription";
import ConstrainedLabel from "./ConstrainedLabel";

export type SubscriptionsListProp = {
    subscriptions : Subscription[];
    faviconCache : Record<number, string>;
};

export default function SubscriptionsList( props : SubscriptionsListProp ) {
    return (
        <ul className="subscription-list">
            { props.subscriptions.map( (item) => { return <li key={item.id}><img src={props.faviconCache[item.id]}></img><ConstrainedLabel title={item.name}></ConstrainedLabel></li>; } ) }
        </ul>
    );
}