import React, { useEffect, useMemo, useRef, useState } from "react";
import { FeedItem } from "../types/feed-item";
import { startOfWeek, endOfWeek, subDays, isSameDay } from 'date-fns';
import styles from './FeedList.module.css';
import { useTranslation } from "react-i18next";
import { GroupedVirtuoso } from 'react-virtuoso'
import FeedListItem from "./FeedListItem";
import FeedListItemPlaceholder from "./FeedListItemPlaceholder";



const today            = new Date();
const yesterday        = subDays( today, 1 );
const currentWeekBegin = startOfWeek( today, {weekStartsOn: 0} );
const currentWeekEnd   = endOfWeek( today, {weekStartsOn: 0} );
const lastWeekBegin    = subDays(currentWeekBegin, 7);
const lastWeekEnd      = subDays(currentWeekEnd, 7);

export type FeedListProp = {
    feedItems              : FeedItem[];
    subscriptionNameRecord : Record<number, string>;
    onClick                : (itemId : number, url : string) => void;
    setIsFeedFavorite      : (itemId : number, value : boolean) => void;
    deleteFeedItems        : (itemIds : number[]) => void;
    onMoreOptionsClick     : (itemId : number, url : string, event: React.MouseEvent) => void;
    onMarkReadClick        : (itemId : number, event: React.MouseEvent) => void;
    onCommentsClick        : (itemId : number, url : string, commentsUrl : string, event: React.MouseEvent) => void;
    onMouseOverFeedItem     : (url : string) => void;
    openInExternalBrowser  : (url : string) => void;
    copyToClipboard        : (url : string) => void;
    setInFeedBin           : (itemIds: number[], value : boolean) => void;
    onCloseFeedOptionsPopup: () => void;
    clearHoveredUrl: () => void;
    commentsActiveId       : number;
    moreOptionsActiveId    : number;
    faviconCache           : Record<number, string>;
    selectedItemId         : number;
    scrollToTopKey         : number;
};

export default function FeedList( props : FeedListProp ) {
    const { t, i18n } = useTranslation();
    const listRef = useRef(null);
    const [isScrolling, setIsScrolling] = useState(false);


    const itemsMap : Record<string, FeedItem[]> = useMemo( () => {
        const map: Record<string, FeedItem[]> = { today: [], yesterday: [], this_week: [], last_week: [] };

        for( const i of props.feedItems ) {
            if (i.pub_date) {
                const d = new Date(i.pub_date);
                if (isSameDay(d, today)) {
                    map['today'].push(i);
                } else if (isSameDay(d, yesterday)) {
                    map['yesterday'].push(i);
                } else if (d >= currentWeekBegin && d <= currentWeekEnd) {
                    map['this_week'].push(i);
                } else if (d >= lastWeekBegin && d <= lastWeekEnd) {
                    map['last_week'].push(i);
                } else {
                    const localizedMonthName = new Intl.DateTimeFormat( i18n.language, { month: 'long' }).format(d);
                    const dateKey = `${localizedMonthName}, ${d.getFullYear()}`;

                    if (!map[dateKey]) {
                        map[dateKey] = [];
                    }
                    map[dateKey].push(i);
                }
            }
        }
        return map;
    }, [props.feedItems, i18n.language] );

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTo({ top: 0 });
        }
    }, [props.scrollToTopKey]);




    const orderedFeedItems: FeedItem[] = useMemo(() => {
        const items: FeedItem[] = [];

        // Order static keys by this particular order
        const fixed = ["today", "yesterday", "this_week", "last_week"];
        for (const key of fixed) {
            if (itemsMap[key]?.length) {
                items.push(...itemsMap[key]);
            }
        }

        // After that comes the dynamic keys with arbitrary dates (e.g. September, 2025)
        const dynamicKeys = Object.keys(itemsMap).filter(
            key => !fixed.includes(key) && itemsMap[key].length > 0
        );

        dynamicKeys.sort((a, b) => {
            const da = new Date(itemsMap[a][0].pub_date).getTime();
            const db = new Date(itemsMap[b][0].pub_date).getTime();
            return db - da; // newest first
        });

        // Add them to the list
        for (const key of dynamicKeys) {
            items.push(...itemsMap[key]);
        }

        return items;
    }, [itemsMap]);

    const groupHeaders : string[] = useMemo( () => {
        const headers : string[] = [];
        for (const key in itemsMap) {
            if (itemsMap.hasOwnProperty(key)) {
                if( itemsMap[key].length > 0) {
                    headers.push( key );
                }
            }
        }
        return headers;
    }, [itemsMap] );

    const groupCounts : number[] = useMemo( () => {
        const counts : number[] = [];
        for (const key in itemsMap) {
            if (itemsMap.hasOwnProperty(key)) {
                if( itemsMap[key].length > 0) {
                    counts.push( itemsMap[key].length );
                }
            }
        }
        return counts;
    }, [itemsMap] );

    return (
        <GroupedVirtuoso
            defaultItemHeight={60}
            ref={listRef}
            context={{ isScrolling }}
            isScrolling={setIsScrolling}
            increaseViewportBy={200}
            onMouseLeave={() => props.clearHoveredUrl()}
            className={styles["feed-date-list"]}
            groupCounts={groupCounts}
            groupContent={(index) => {
                return (
                    <h3 className={styles["feed-date-header"]}>{t(groupHeaders[index])}</h3>
                );
            }}
            itemContent={(index, groupIndex) => {
                const item = orderedFeedItems[index];

                return (

                    (item) ?
                        (isScrolling)
                            ? <FeedListItemPlaceholder
                                id={item.id}
                                key={item.id}
                                title={item.title}
                                favicon={props.faviconCache[item.sub_id]}
                                isRead={item.is_read}
                                isSelected={item.id === props.selectedItemId}
                                commentsActiveId={props.commentsActiveId}
                              />
                            : <FeedListItem
                                id={item.id}
                                key={item.id}
                                title={item.title}
                                subName={props.subscriptionNameRecord[item.sub_id] ?? ''}
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
                                onMouseOverFeedItem={props.onMouseOverFeedItem}
                                commentsActiveId={props.commentsActiveId}
                                moreOptionsActiveId={props.moreOptionsActiveId}
                                openInExternalBrowser={props.openInExternalBrowser}
                                copyToClipboard={props.copyToClipboard}
                                setInFeedBin={props.setInFeedBin}
                                inFeedBin={item.in_feed_bin}
                            ></FeedListItem>

                    : <div style={{height: 60}}></div>
                )
            }}
        />
    );
}