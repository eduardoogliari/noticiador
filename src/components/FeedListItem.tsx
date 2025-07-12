export type FeedListItemProp = {
    url : string;
    title : string;
    onClick : (url:string) => void;
};

export default function FeedListItem( props : FeedListItemProp ) {
    return (
        <li onClick={() => props.onClick(props.url)}>{props.title}</li>
    );
}