import { Subscription } from "../types/subscription";
import ConstrainedLabel from "./ConstrainedLabel";

export type SubscriptionsListProp = {
    subscriptions : Subscription[];
    faviconCache : Record<number, string>;
    selectedSubscriptionId : number;
    onClick : (subId : number) => void;
};

export default function SubscriptionsList( props : SubscriptionsListProp ) {
    return (
        <ul className="subscription-list">
            { props.subscriptions.map( (item) => { return <li onClick={() => props.onClick(item.id)} className={`subscription-list-item ${props.selectedSubscriptionId == item.id ? 'selected' : ''}`} key={item.id}><img src={props.faviconCache[item.id]}></img><ConstrainedLabel title={item.name}></ConstrainedLabel></li>; } ) }
        </ul>
    );
}