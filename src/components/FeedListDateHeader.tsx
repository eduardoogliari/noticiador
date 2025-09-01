import { useEffect } from "react";
import { FeedItem } from "../types/feed-item";
import FeedListItem from "./FeedListItem";

export type FeedListDateHeaderProps = {
    name                   : string;
    feedItems              : FeedItem[];
    onClick                : (itemId : number, url : string) => void;
    setIsFeedFavorite : (itemId : number, value : boolean) => void;
    deleteFeedItems : (itemIds : number[]) => void;
    onMoreOptionsClick     : (itemId : number, url : string, event: React.MouseEvent) => void;
    onMarkReadClick         : (itemId : number, event: React.MouseEvent) => void;
    onCommentsClick        : (itemId : number, url : string, commentsUrl : string, event: React.MouseEvent) => void;
    openInExternalBrowser   : (url : string) => void;
    copyToClipboard   : (url : string) => void;
    setInFeedBin : (itemIds: number[], value : boolean) => void;
    onCloseFeedOptionsPopup: () => void;
    commentsActiveId       : number;
    moreOptionsActiveId    : number;
    faviconCache           : Record<number, string>;
    selectedItemId         : number;
};

export default function FeedListDateHeader( props : FeedListDateHeaderProps ) {
    const items = props.feedItems.map( (item, index) => {
        return (
            <FeedListItem
                id={item.id}
                key={item.id}
                title={item.title}
                url={item.url}
                commentsUrl={item.comments_url}
                summary={item.summary}
                favicon={props.faviconCache[item.sub_id]}
                isSelected={item.id === props.selectedItemId}
                onClick={ props.onClick }
                isFavorite={item.is_favorite}
                isRead={item.is_read}
                setIsFeedFavorite={props.setIsFeedFavorite}
                deleteFeedItems={props.deleteFeedItems}
                onMoreOptionsClick={props.onMoreOptionsClick}
                onCommentsClick={props.onCommentsClick}
                onMarkReadClick={props.onMarkReadClick}
                onCloseFeedOptionsPopup={props.onCloseFeedOptionsPopup}
                commentsActiveId={props.commentsActiveId}
                moreOptionsActiveId={props.moreOptionsActiveId}
                openInExternalBrowser={props.openInExternalBrowser}
                copyToClipboard={props.copyToClipboard}
                setInFeedBin={props.setInFeedBin}
                inFeedBin={item.in_feed_bin}
            ></FeedListItem>
        );
    });

    return (
        <>
            <h3 className="feed-date-header">{props.name}</h3>
            <ul className="feed-list">
                {items}
            </ul>
        </>
    );
}