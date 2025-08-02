export type FeedListItemProp = {
    id        : number;
    url       : string;
    title     : string;
    onClick   : (itemId : number) => void;
    onFavoriteClick : (itemId : number, event: React.MouseEvent) => void;
    isSelected: boolean;
    favicon   : string;
    isFavorite : boolean;
};

export default function FeedListItem( props : FeedListItemProp ) {
    return (
        <li className={`feed-item  ${props.isSelected ? "selected" : ""}`} onClick={() => props.onClick(props.id)}>
            <span className={`feed-item-favorite ${props.isFavorite || props.isSelected ? 'favorite' : ''}`} onClick={(e) => props.onFavoriteClick(props.id, e)}>{props.isFavorite ? '★' : '☆' }</span>
            {(props.favicon) ? <img src={props.favicon}></img> : <span></span>}
            <span>{props.title}</span>
        </li>
    );
}