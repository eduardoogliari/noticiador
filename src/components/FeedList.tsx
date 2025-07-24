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
    onClick       : (itemId : number) => void;
    faviconCache  : Record<number, string>;
    selectedItemId: number;
};

export default function FeedList( props : FeedListProp ) {
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

    return (
        <ul className="feed-date-list">
            {
                Object.entries(itemsMap).filter( ([key, value]) => value.length > 0 ).map( ([key, value]) => {
                    return (
                        <li key={key}>
                            <FeedListDateHeader
                                faviconCache={props.faviconCache}
                                feedItems={value}
                                onClick={props.onClick}
                                name={key}
                                selectedItemId={props.selectedItemId}
                            ></FeedListDateHeader>
                        </li>
                    )
                })
            }
        </ul>
    );
}