import { useEffect } from "react";
import { FeedItem } from "../types/feed-item";
import FeedListItem from "./FeedListItem";

export type FeedListDateHeaderProps = {
    name          : string;
    feedItems     : FeedItem[];
    onClick       : (itemId : number, url : string) => void;
    onFavoriteClick : (itemId : number, value : boolean, event: React.MouseEvent) => void;
    faviconCache  : Record<number, string>;
    selectedItemId: number;
};

export default function FeedListDateHeader( props : FeedListDateHeaderProps ) {
    const items = props.feedItems.map( (item, index) => {
        return (
            <FeedListItem
                id={item.id}
                key={item.id}
                title={item.title}
                url={item.url}
                favicon={props.faviconCache[item.sub_id]}
                isSelected={item.id === props.selectedItemId}
                onClick={ props.onClick }
                isFavorite={item.is_favorite}
                isRead={item.is_read}
                onFavoriteClick={props.onFavoriteClick}
            ></FeedListItem>
        );
    });

    useEffect(() => {
        console.log( 'props', props );
    }, [props.feedItems]);

    return (
        <>
            <h3 className="feed-date-header">{props.name}</h3>
            <ul className="feed-list">
                {items}
            </ul>
        </>
    );
}