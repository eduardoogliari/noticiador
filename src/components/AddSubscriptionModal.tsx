import { useEffect, useRef, useState } from "react";
import { NewSubscription } from "../types/subscription";
const isUrlHttp = require('is-url-http');
const sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;

const defaultMessageInfo = 'Waiting for input...';
const validatingMessageInfo = 'Validating URL...';
const errorMessageInfo = "Invalid URL. Please provide a valid url in the format: 'https://example.com'";

export default function AddSubscriptionModal() {
    const [messageInfo, setMessageInfo]     = useState(defaultMessageInfo);
    const [inputURL, setInputURL]                     = useState('');
    const inputRef                          = useRef<HTMLInputElement>(null);
    const [inputDisabled, setInputDisabled] = useState(false);

    // Input focus by default
    useEffect( () => {
        setMessageInfo(defaultMessageInfo);
        inputRef.current?.focus();
    }, [] );


    function onInputChanged( e : React.ChangeEvent<HTMLInputElement>) {
        setInputURL( e.target.value );
    }

    async function onClick(  ) {
        await sendData();
    }

    async function onKeyUp( event : React.KeyboardEvent ) {
        console.log( event.key );
        if( event.key == 'Enter' ) {
            await sendData();
        }
    }

    async function sendData() {
        setInputDisabled(true);
        setMessageInfo( validatingMessageInfo );

        let url = sanitizeUrl( inputURL.replaceAll(' ', '') );

        // Add https if missing
        if (!/^https?:\/\//i.test(url)) {
            url = "https://" + url;
        }

        if( isUrlHttp(url) ) {
            const faviconBlob = await window.rssAPI.getFavicon( url );

            const feedUrl = await window.rssAPI.findFeedURL( url );
            if( feedUrl ) {
                const title = await window.rssAPI.getFeedTitle( feedUrl );

                const s : NewSubscription = { name: title, url: feedUrl,  last_updated: new Date().toISOString(), favicon: faviconBlob  };
                await window.rssAPI.addSubscriptions( [s] );
                console.log( 'added', s );

                window.rssAPI.signalSubscriptionsChanged();
                window.electronApi.closeModal();

            } else {
                console.warn(`No feed found for ${url}`);
                setMessageInfo( 'No RSS feed found at provided URL' );
            }
        } else {
            setMessageInfo( errorMessageInfo );
        }
        setInputDisabled(false);
    }

    return (
        <>
            <div className="add-subscription-modal-container">

                <div className="add-subscription-modal">

                    <div className="add-subscription-input" >
                        <input
                            ref={inputRef}
                            placeholder="Enter the website's URL (for instance: example.com/rss)"
                            onChange={onInputChanged}
                            value={inputURL}
                            onKeyUp={onKeyUp}
                            disabled={inputDisabled}
                        ></input>

                        <button onClick={onClick} disabled={inputDisabled}>Add</button>
                    </div>

                    <div className="add-subscription-info">
                        <span>{messageInfo}</span>
                    </div>
                </div>
            </div>
        </>
    );
}