export type ExpandableGroup = {
    title : string;
    children? : React.ReactNode;
};

export default function ExpandableGroup( props : ExpandableGroup ) {
    return (
        <>
            <h3>{props.title}</h3>
            {props.children}
        </>
    );
}