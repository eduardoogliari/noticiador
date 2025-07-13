export type FeedListItemProp = {
    url : string;
    title : string;
    onClick : (url:string) => void;
    isSelected : boolean;
};

export default function FeedListItem( props : FeedListItemProp ) {
    return (
        <li className={`feed-item  ${props.isSelected ? "selected" : ""}`} onClick={() => props.onClick(props.url)}>
            <div>{props.title}</div>
        </li>
    );
}