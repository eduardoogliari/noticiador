import { FeedItem } from "../types/FeedItem";
import FeedListItem from "./FeedListItem";

export type FeedListProp = {
    feedItems : FeedItem[];
    onClick : (url : string) => void;
};

export default function FeedList( props : FeedListProp ) {
    const items = props.feedItems.map( (item, index) => {
        return <FeedListItem key={index} title={item.title} url={item.link} onClick={props.onClick}></FeedListItem>
    });

    return (
        <ul>
            {items}
        </ul>
    );
}