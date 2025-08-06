export type FeedListItemProp = {
    id        : number;
    url       : string;
    title     : string;
    onClick   : (itemId : number, url : string) => void;
    onFavoriteClick : (itemId : number, value : boolean, event: React.MouseEvent) => void;
    onMoreOptionsClick : (itemId : number, url : string, event: React.MouseEvent) => void;
    isSelected: boolean;
    favicon   : string;
    isFavorite : boolean;
    isRead : boolean;
};

export default function FeedListItem( props : FeedListItemProp ) {
    return (
        <li className={`feed-item  ${props.isSelected ? 'selected' : ''} ${props.isRead ? 'read' : ''}`} onClick={() => props.onClick(props.id, props.url)}>
            <span className={`feed-item-favorite-container ${props.isFavorite || props.isSelected ? 'favorite' : ''}`} onClick={(e) => props.onFavoriteClick(props.id, !props.isFavorite, e)} >
                <span className={'feed-item-favorite'}>
                    {props.isFavorite ? '★' : '☆' }
                </span>
            </span>
            {(props.favicon) ? <img src={props.favicon}></img> : '' }
            <span className="feed-item-title">{props.title}</span>

            <span className={'feed-item-options-container'} onClick={(e) => props.onMoreOptionsClick( props.id, props.url, e )}>
                <span>...</span>
            </span>
        </li>
    );
}