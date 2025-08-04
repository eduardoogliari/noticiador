import { createPortal } from "react-dom";

export type AddSubscriptionModalProp = {
    isOpen : boolean;
}

export default function AddSubscriptionModal( props: AddSubscriptionModalProp ) {
    if(!props.isOpen) { return null; }

    return (
        <>
            {createPortal(
                <div className="modal-overlay">
                    <div className="add-subscription-modal">
                        <p>Ola portal</p>
                    </div>
                </div>
            , document.body )}
        </>
    );
}