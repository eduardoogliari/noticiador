export type FeedListItemProp = {
    id        : number;
    url       : string;
    title     : string;
    onClick   : (itemId : number) => void;
    isSelected: boolean;
    favicon   : string;
};

export default function FeedListItem( props : FeedListItemProp ) {
    return (
        <li className={`feed-item  ${props.isSelected ? "selected" : ""}`} onClick={() => props.onClick(props.id)}>
            {(props.favicon) ? <img src={props.favicon}></img> : <span>📰</span>}
            <span>{props.title}</span>
        </li>
    );
}