import { useRef } from "react";
import ConstrainedLabel from "./ConstrainedLabel";
import ContextPopup, {ContextPopupOption} from "./ContextPopup";
import { ModalType } from "../types/modal-type";
import styles from './SubscriptionListItem.module.css'

export type SubscriptionListItemProp = {
    id : number;
    name : string;
    faviconCache : Record<number, string>;
    selectedSubscriptionId : number;
    selectedSubscriptionOptionsId : number;
    onClickSubTitle : (subId : number) => void;
    onClickSubOptions : (subId : number, event: React.MouseEvent) => void;
    onCloseSubOptions : () => void;
    subscriptionsBeingRefreshed: Set<number>;
    unreadFeedsCount : number;
    feedCount : number;
};


export default function SubscriptionListItem( props : SubscriptionListItemProp ) {
     const subOptionsRef = useRef<HTMLElement>(null);

    const subItemContextOptions : ContextPopupOption[] = [
        {
            optionTitle: 'Delete Subscription',
            icon: '../icons/x.svg',
            action: async () => {
                window.electronApi.openModal( { type: ModalType.ConfirmDeleteSubscription, data: { subId: props.id, subName: props.name } } );
                props.onCloseSubOptions();
            }
        },
    ];

    return (
        <li
            onClick={() => props.onClickSubTitle(props.id)}
            className={`${styles['subscription-list-item']} ${props.selectedSubscriptionId == props.id ? styles.selected : ''}`}
            key={props.id}
        >

            <span className={styles["subscription-status"]}>
            {
                (props.subscriptionsBeingRefreshed.has(props.id))
                    ? <span><img width={'16px'} height={'16px'} src={'../icons/reload.svg'}></img></span>
                    // : <span>({props.unreadFeedsCount})</span>
                    : <span>({props.feedCount})</span>
            }
            </span>


            <img src={props.faviconCache[props.id]}></img>
            <ConstrainedLabel title={props.name}></ConstrainedLabel>



            <span
                ref={subOptionsRef}
                className={`${styles['subscription-list-item-options-container']} ${props.selectedSubscriptionOptionsId === props.id ? styles.selected : ''}`}
                onClick={(e) => { props.onClickSubOptions(props.id, e); }}
            >
                <span>⋮</span>
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