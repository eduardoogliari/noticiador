import { useEffect, useRef } from "react";
import ContextPopup, {ContextPopupOption} from "./ContextPopup";

export type FeedListItemProp = {
    id                      : number;
    url                     : string;
    commentsUrl            ?: string;
    title                   : string;
    onClick                 : (itemId : number, url : string) => void;
    onFavoriteClick         : (itemId : number, value : boolean, event: React.MouseEvent) => void;
    onMoreOptionsClick      : (itemId : number, url : string, event: React.MouseEvent) => void;
    onCommentsClick         : (itemId : number, url : string, commentsUrl : string, event: React.MouseEvent) => void;
    openInExternalBrowser   : (url : string) => void;
    copyToClipboard   : (url : string) => void;
    onCloseFeedOptionsPopup : () => void;
    isSelected              : boolean;
    commentsActiveId        : number;
    moreOptionsActiveId     : number;
    favicon                 : string;
    isFavorite              : boolean;
    isRead                  : boolean;
};



export default function FeedListItem( props : FeedListItemProp ) {
    const moreOptionsRef = useRef<HTMLElement>(null);

    const optionsContainerVisible = props.isSelected || props.commentsActiveId === props.id || props.moreOptionsActiveId === props.id;

     const feedItemContextOptions : ContextPopupOption[] = [
        { optionTitle: 'Open in external browser', action: () => {  props.openInExternalBrowser( props.url ); props.onCloseFeedOptionsPopup(); } },
        { optionTitle: 'Copy link', action: () => { props.copyToClipboard( props.url ); props.onCloseFeedOptionsPopup(); } },
        { optionTitle: 'Move to feed bin', action: () => {props.onCloseFeedOptionsPopup();} },
    ];

    return (
        <li className={`feed-item  ${props.isSelected ? 'selected' : ''} ${props.isRead ? 'read' : ''}`} onClick={() => props.onClick(props.id, props.url)}>
            <span className={`feed-item-favorite-container ${props.isFavorite || props.isSelected ? 'favorite' : ''}`} onClick={(e) => props.onFavoriteClick(props.id, !props.isFavorite, e)} >
                <span className={'feed-item-favorite'}>
                    {props.isFavorite ? '★' : '☆' }
                </span>
            </span>
            {(props.favicon) ? <img src={props.favicon}></img> : '' }
            <span className="feed-item-title">{props.title}</span>

            <span className={`feed-item-options-container ${optionsContainerVisible ? 'visible' : ''}`}>
                {props.commentsUrl ?
                    <span className={`feed-item-comments-container ${props.commentsActiveId === props.id ? 'selected' : ''}`} onClick={(e) => props.onCommentsClick( props.id, props.url, props.commentsUrl, e )}>
                    {
                        props.commentsUrl
                            ? <span className={`feed-item-comments`} >💬</span>
                            : ''
                    }
                    </span>
                    : ''}
                <span ref={moreOptionsRef} className={`feed-items-more-options-container ${props.moreOptionsActiveId === props.id ? 'selected' : ''}`} onClick={(e) => props.onMoreOptionsClick( props.id, props.url, e )}>
                    <span>...</span>
                    {
                        (props.moreOptionsActiveId === props.id)
                            ? <ContextPopup anchorRef={moreOptionsRef} onClose={props.onCloseFeedOptionsPopup} options={feedItemContextOptions}></ContextPopup>
                            : ''
                    }
                </span>
            </span>
        </li>
    );
}