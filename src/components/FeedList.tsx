import { useState } from "react";
import { FeedItem } from "../types/FeedItem";
import FeedListItem from "./FeedListItem";

export type FeedListProp = {
    feedItems : FeedItem[];
    onClick : (url : string) => void;
};

export default function FeedList( props : FeedListProp ) {
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const items = props.feedItems.map( (item, index) => {
        return <FeedListItem key={index} title={item.title} url={item.url} isSelected={index == selectedIndex} onClick={(url:string) => {
            setSelectedIndex(index);
            props.onClick(url);
        }}></FeedListItem>
    });

    return (
        <ul className="feed-list">
            {items}
        </ul>
    );
}