import { useEffect, useRef } from "react";
import ContextPopup, {ContextPopupOption} from "./ContextPopup";

export type FeedListItemProp = {
    id                      : number;
    url                     : string;
    commentsUrl             ?: string;
    summary                 ?: string;
    title                   : string;
    onClick                 : (itemId : number, url : string) => void;
    // onFavoriteClick         : (itemId : number, value : boolean, event: React.MouseEvent) => void;
    setIsFeedFavorite : (itemId : number, value : boolean) => void;
    deleteFeedItem : (itemId : number) => void;
    onMoreOptionsClick      : (itemId : number, url : string, event: React.MouseEvent) => void;
    onCommentsClick         : (itemId : number, url : string, commentsUrl : string, event: React.MouseEvent) => void;
    openInExternalBrowser   : (url : string) => void;
    copyToClipboard   : (url : string) => void;
    setInFeedBin : (itemId: number, value : boolean) => void;
    onCloseFeedOptionsPopup : () => void;
    isSelected              : boolean;
    commentsActiveId        : number;
    moreOptionsActiveId     : number;
    favicon                 : string;
    isFavorite              : boolean;
    isRead                  : boolean;
    inFeedBin               : boolean;
};



export default function FeedListItem( props : FeedListItemProp ) {
    const moreOptionsRef = useRef<HTMLElement>(null);

    const optionsContainerVisible = props.isSelected || props.commentsActiveId === props.id || props.moreOptionsActiveId === props.id;

    // Feed Bin context options
    const inFeedBinContextOptions : ContextPopupOption[] = [
        { optionTitle: 'Restore item', action: () => {props.setInFeedBin(props.id, false); props.onCloseFeedOptionsPopup();} },
        { optionTitle: 'Delete permanently', action: () => { props.deleteFeedItem(props.id); props.onCloseFeedOptionsPopup(); } },
    ];
    const outFeedBinContextOptions : ContextPopupOption[] = [
        { optionTitle: 'Move to Feed Bin', action: () => {props.setInFeedBin(props.id, true); props.onCloseFeedOptionsPopup();} },
    ];

    // Favorite context options
    const inFavoritesContextOptions : ContextPopupOption[] = [
        { optionTitle: 'Remove from Favorites', action: () => { props.setIsFeedFavorite( props.id, false ); props.onCloseFeedOptionsPopup(); } },
    ];
    const outFavoritesContextOptions : ContextPopupOption[] = [
        { optionTitle: 'Move to Favorites', action: () => { props.setIsFeedFavorite( props.id, true ); props.onCloseFeedOptionsPopup(); } },
    ];

    // Build context menu options
    const feedItemContextOptions : ContextPopupOption[] = [
        { optionTitle: 'Open in external browser', action: () => {  props.openInExternalBrowser( props.url ); props.onCloseFeedOptionsPopup(); } },
        { optionTitle: 'Copy link', action: () => { props.copyToClipboard( props.url ); props.onCloseFeedOptionsPopup(); } },

    ]
    .concat(
        ( props.isFavorite )
            ? inFavoritesContextOptions
            : (props.inFeedBin)
                ? [] // Do not show favorite options if item is in bin
                : outFavoritesContextOptions
    )
    .concat(
        ( props.inFeedBin )
            ? inFeedBinContextOptions
            : (props.isFavorite)
                ? [] // Do not show bin options if item is favorited
                : outFeedBinContextOptions
    );

    return (
        <li
            tabIndex={0}
            className={`feed-item  ${props.isSelected ? 'selected' : ''} ${props.isRead ? 'read' : ''}`}
            onClick={() => props.onClick(props.id, props.url)}
        >
            {
                (props.favicon)
                    ? <img className="feed-item-favicon" src={props.favicon}></img>
                    : ''
            }
            <span className="feed-item-title" title={props.summary ?? props.title } aria-label={props.summary ?? props.title}>{props.title}</span>

            <span className={`feed-item-options-container ${optionsContainerVisible ? 'visible' : ''}`}>
                {props.commentsUrl ?
                    <span className={`feed-item-comments-container ${props.commentsActiveId === props.id ? 'selected' : ''}`} onClick={(e) => props.onCommentsClick( props.id, props.url, props.commentsUrl, e )}>
                    {
                        props.commentsUrl
                            ? <span className={`feed-item-comments`} title={'Comments'}>💬</span>
                            : ''
                    }
                    </span>
                    : ''}
                <span
                    ref={moreOptionsRef}
                    className={`feed-items-more-options-container ${props.moreOptionsActiveId === props.id ? 'selected' : ''}`}
                    onClick={(e) => props.onMoreOptionsClick( props.id, props.url, e )}
                >
                    <span title={'More options'}>⋮</span>
                    {
                        (props.moreOptionsActiveId === props.id)
                            ?   <ContextPopup
                                    anchorRef={moreOptionsRef}
                                    alignment="top"
                                    onClose={props.onCloseFeedOptionsPopup}
                                    options={feedItemContextOptions}
                                ></ContextPopup>
                            : ''
                    }
                </span>
            </span>
        </li>
    );
}