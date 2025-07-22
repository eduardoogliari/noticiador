export type FeedListItemProp = {
    url       : string;
    title     : string;
    onClick   : (url:string) => void;
    isSelected: boolean;
    favicon   : string;
};

export default function FeedListItem( props : FeedListItemProp ) {
    return (
        <li className={`feed-item  ${props.isSelected ? "selected" : ""}`} onClick={() => props.onClick(props.url)}>
            {(props.favicon) ? <img src={props.favicon}></img> : <span>📰</span>}
            <span>{props.title}</span>
        </li>
    );
}