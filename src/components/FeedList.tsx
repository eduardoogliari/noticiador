import { useEffect, useRef } from "react";
import { FeedItem } from "../types/feed-item";
import FeedListDateHeader from "./FeedListDateHeader";
import { startOfWeek, endOfWeek, subDays, isSameDay } from 'date-fns'

const today            = new Date();
const yesterday        = subDays( today, 1 );
const currentWeekBegin = startOfWeek( today, {weekStartsOn: 0} );
const currentWeekEnd   = endOfWeek( today, {weekStartsOn: 0} );
const lastWeekBegin    = subDays(currentWeekBegin, 7);
const lastWeekEnd      = subDays(currentWeekEnd, 7);

export type FeedListProp = {
    feedItems     : FeedItem[];
    onClick       : (itemId : number, url : string) => void;
    setIsFeedFavorite : (itemId : number, value : boolean) => void;
    deleteFeedItems : (itemIds : number[]) => void;
    onMoreOptionsClick : (itemId : number, url : string, event: React.MouseEvent) => void;
    onMarkReadClick         : (itemId : number, event: React.MouseEvent) => void;
    onCommentsClick : (itemId : number, url : string, commentsUrl : string, event: React.MouseEvent) => void;
    openInExternalBrowser   : (url : string) => void;
    copyToClipboard   : (url : string) => void;
    setInFeedBin : (itemIds: number[], value : boolean) => void;
    onCloseFeedOptionsPopup : () => void;
    commentsActiveId : number;
    moreOptionsActiveId : number;
    faviconCache  : Record<number, string>;
    selectedItemId: number;
    scrollToTopKey : number;
};

export default function FeedList( props : FeedListProp ) {
    const listRef = useRef(null);

    const itemsMap : Record<string, FeedItem[]> = { 'Today': [], 'Yesterday' : [], 'This week' : [], 'Last week' : [] };

    for( const i of props.feedItems ) {
        if (i.pub_date) {
            const d = new Date(i.pub_date);
            if (isSameDay(d, today)) {
                itemsMap['Today'].push(i);
            } else if (isSameDay(d, yesterday)) {
                itemsMap['Yesterday'].push(i);
            } else if (d >= currentWeekBegin && d <= currentWeekEnd) {
                itemsMap['This week'].push(i);
            } else if (d >= lastWeekBegin && d <= lastWeekEnd) {
                itemsMap['Last week'].push(i);
            } else {
                const localizedMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(d);
                const dateKey = `${localizedMonthName}, ${d.getFullYear()}`;

                if (!itemsMap[dateKey]) {
                    itemsMap[dateKey] = [];
                }
                itemsMap[dateKey].push(i);
            }
        }
    }

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTo({ top: 0 });
        }
    }, [props.scrollToTopKey]);

    return (
        <ul ref={listRef} className="feed-date-list">
            {
                Object.entries(itemsMap).filter( ([key, value]) => value.length > 0 ).map( ([key, value]) => {
                    return (
                        <li key={key}>
                            <FeedListDateHeader
                                faviconCache={props.faviconCache}
                                feedItems={value}
                                onClick={props.onClick}
                                setIsFeedFavorite={props.setIsFeedFavorite}
                                deleteFeedItems={props.deleteFeedItems}
                                name={key}
                                selectedItemId={props.selectedItemId}
                                onMoreOptionsClick={props.onMoreOptionsClick}
                                onMarkReadClick={props.onMarkReadClick}
                                onCommentsClick={props.onCommentsClick}
                                commentsActiveId={props.commentsActiveId}
                                moreOptionsActiveId={props.moreOptionsActiveId}
                                onCloseFeedOptionsPopup={props.onCloseFeedOptionsPopup}
                                openInExternalBrowser={props.openInExternalBrowser}
                                copyToClipboard={props.copyToClipboard}
                                setInFeedBin={props.setInFeedBin}
                            ></FeedListDateHeader>
                        </li>
                    )
                })
            }
        </ul>
    );
}