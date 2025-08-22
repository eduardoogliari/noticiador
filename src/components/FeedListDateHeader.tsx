import { useEffect } from "react";
import { FeedItem } from "../types/feed-item";
import FeedListItem from "./FeedListItem";

export type FeedListDateHeaderProps = {
    name                   : string;
    feedItems              : FeedItem[];
    onClick                : (itemId : number, url : string) => void;
    // onFavoriteClick        : (itemId : number, value : boolean, event: React.MouseEvent) => void;
    setIsFeedFavorite : (itemId : number, value : boolean) => void;
    deleteFeedItem : (itemId : number) => void;
    onMoreOptionsClick     : (itemId : number, url : string, event: React.MouseEvent) => void;
    onCommentsClick        : (itemId : number, url : string, commentsUrl : string, event: React.MouseEvent) => void;
    openInExternalBrowser   : (url : string) => void;
    copyToClipboard   : (url : string) => void;
    setInFeedBin : (itemId: number, value : boolean) => void;
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
                // onFavoriteClick={props.onFavoriteClick}
                setIsFeedFavorite={props.setIsFeedFavorite}
                deleteFeedItem={props.deleteFeedItem}
                onMoreOptionsClick={props.onMoreOptionsClick}
                onCommentsClick={props.onCommentsClick}
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

    // useEffect(() => {
    //     console.log( 'props', props );
    // }, [props.feedItems]);

    return (
        <>
            <h3 className="feed-date-header">{props.name}</h3>
            <ul className="feed-list">
                {items}
            </ul>
        </>
    );
}