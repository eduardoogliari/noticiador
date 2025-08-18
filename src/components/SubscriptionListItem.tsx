import { useRef } from "react";
import ConstrainedLabel from "./ConstrainedLabel";
import ContextPopup, {ContextPopupOption} from "./ContextPopup";

export type SubscriptionListItemProp = {
    id : number;
    name : string;
    faviconCache : Record<number, string>;
    selectedSubscriptionId : number;
    selectedSubscriptionOptionsId : number;
    onClickSubTitle : (subId : number) => void;
    onClickSubOptions : (subId : number, event: React.MouseEvent) => void;
    onCloseSubOptions : () => void;
};


export default function SubscriptionListItem( props : SubscriptionListItemProp ) {
     const subOptionsRef = useRef<HTMLElement>(null);

    const subItemContextOptions : ContextPopupOption[] = [
        { optionTitle: 'Delete subscription', action: () => {  props.onCloseSubOptions(); } },
    ];

    return (
        <li
            onClick={() => props.onClickSubTitle(props.id)}
            className={`subscription-list-item ${props.selectedSubscriptionId == props.id ? 'selected' : ''}`}
            key={props.id}
        >
            <img src={props.faviconCache[props.id]}></img>
            <ConstrainedLabel title={props.name}></ConstrainedLabel>

            <span
                ref={subOptionsRef}
                className={`subscription-list-item-options-container ${props.selectedSubscriptionOptionsId === props.id ? 'selected' : ''}`}
                onClick={(e) => { props.onClickSubOptions(props.id, e); }}
            >
                <span className={`subscription-list-item-options-button`}>⋮</span>
                {
                    (props.selectedSubscriptionOptionsId === props.id)
                        ?
                            <ContextPopup
                                anchorRef={subOptionsRef}
                                alignment="right"
                                onClose={props.onCloseSubOptions}
                                options={subItemContextOptions}
                            ></ContextPopup>
                        :
                            ''
                }
            </span>

        </li>
    );
}