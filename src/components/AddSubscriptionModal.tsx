import { useEffect, useRef, useState } from "react";

const defaultMessageInfo = 'Waiting for input...';

export default function AddSubscriptionModal() {
    const [messageInfo, setMessageInfo]     = useState(defaultMessageInfo);
    const [submitEnabled, setSubmitEnabled] = useState(false);
    const inputRef                          = useRef<HTMLInputElement>(null);

    // Input focus by default
    useEffect( () => {
        setSubmitEnabled(false);
        setMessageInfo(defaultMessageInfo);
        inputRef.current?.focus();
    }, [] );


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
            <div className="add-subscription-modal-container">

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
        </>
    );
}