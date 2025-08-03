export type FeedListItemProp = {
    id        : number;
    url       : string;
    title     : string;
    onClick   : (itemId : number, url : string) => void;
    onFavoriteClick : (itemId : number, value : boolean, event: React.MouseEvent) => void;
    isSelected: boolean;
    favicon   : string;
    isFavorite : boolean;
    isRead : boolean;
};

export default function FeedListItem( props : FeedListItemProp ) {
    return (
        <li className={`feed-item  ${props.isSelected ? 'selected' : ''} ${props.isRead ? 'read' : ''}`} onClick={() => props.onClick(props.id, props.url)}>
            <span
                className={`feed-item-favorite
                            ${props.isFavorite || props.isSelected ? 'favorite' : ''}

                        `}
                onClick={(e) => props.onFavoriteClick(props.id, !props.isFavorite, e)}>{props.isFavorite ? '★' : '☆' }
            </span>
            {(props.favicon) ? <img src={props.favicon}></img> : <span></span>}
            <span>{props.title}</span>
        </li>
    );
}