import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type AddSubscriptionModalProp = {
    isOpen : boolean;
    onClose : () => void;
}

const defaultMessageInfo = 'Waiting for input...';

export default function AddSubscriptionModal( props: AddSubscriptionModalProp ) {
    const [messageInfo, setMessageInfo] = useState(defaultMessageInfo);
    const [submitEnabled, setSubmitEnabled] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Escape to close popup
    useEffect( () => {
        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.onClose();
            }
        };
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [] );

    // Input focus by default
    useEffect( () => {
        if (props.isOpen) {
            setSubmitEnabled(false);
            setMessageInfo(defaultMessageInfo);
            inputRef.current?.focus();
        }
    }, [props.isOpen] );


    function onInputChanged( e : React.ChangeEvent<HTMLInputElement>) {
        if( e.target.value.length > 0 ) {
            setMessageInfo( 'Checking if URL contains a feed...' );
        } else {
            setMessageInfo( defaultMessageInfo );
        }
        console.log( 'onInputChanged: ', e.target.value );
    }

    return (
        <>
        {
            (props.isOpen)
                ?   createPortal(
                        <div className="modal-overlay" onClick={props.onClose}>

                            <div className="add-subscription-modal-container">

                                <div className="add-subscription-modal-title-bar" onClick={(e) => e.stopPropagation()}>
                                    <span>Add new feed</span>
                                    <button onClick={props.onClose}>x</button>
                                </div>

                                <div className="add-subscription-modal" onClick={(e) => e.stopPropagation()}>
                                    <div className="add-subscription-input" >
                                        <input ref={inputRef} placeholder="Inform the feed URL (e.g. https://example.com/rss)" onChange={onInputChanged}></input>
                                        <button disabled={!submitEnabled}>Add</button>
                                    </div>

                                    <div className="add-subscription-info">
                                        <span>{messageInfo}</span>
                                    </div>
                                </div>

                            </div>

                        </div>
                    , document.body )
                :   null
        }
        </>
    );
}