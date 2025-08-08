import { useEffect } from "react";

export type FeedListItemProp = {
    id        : number;
    url       : string;
    commentsUrl ?: string;
    title     : string;
    onClick   : (itemId : number, url : string) => void;
    onFavoriteClick : (itemId : number, value : boolean, event: React.MouseEvent) => void;
    onMoreOptionsClick : (itemId : number, url : string, event: React.MouseEvent) => void;
    onCommentsClick : (itemId : number, url : string, commentsUrl : string, event: React.MouseEvent) => void;
    isSelected: boolean;
    commentsActiveId : number;
    favicon   : string;
    isFavorite : boolean;
    isRead : boolean;
};

export default function FeedListItem( props : FeedListItemProp ) {
    useEffect( () => { console.log('props.commentsActiveId: ', props.commentsActiveId); }, [props.commentsActiveId]);

    return (
        <li className={`feed-item  ${props.isSelected ? 'selected' : ''} ${props.isRead ? 'read' : ''}`} onClick={() => props.onClick(props.id, props.url)}>
            <span className={`feed-item-favorite-container ${props.isFavorite || props.isSelected ? 'favorite' : ''}`} onClick={(e) => props.onFavoriteClick(props.id, !props.isFavorite, e)} >
                <span className={'feed-item-favorite'}>
                    {props.isFavorite ? '★' : '☆' }
                </span>
            </span>
            {(props.favicon) ? <img src={props.favicon}></img> : '' }
            <span className="feed-item-title">{props.title}</span>

            <span className={`feed-item-options-container ${props.isSelected ? 'selected' : ''}`} onClick={(e) => props.onMoreOptionsClick( props.id, props.url, e )}>
                {/* <span className={`feed-item-options}`} > */}
                    {props.commentsUrl ?
                        <span className={`feed-item-comments-container ${props.commentsActiveId === props.id ? 'selected' : ''}`} onClick={(e) => props.onCommentsClick( props.id, props.url, props.commentsUrl, e )}>
                        {
                            props.commentsUrl
                                ? <span className={`feed-item-comments`} >💬</span>
                                : ''
                        }
                        </span>
                        : ''}
                    <span className={`feed-items-more-options-container`}>
                        <span>...</span>
                    </span>
                {/* </span> */}
            </span>
        </li>
    );
}