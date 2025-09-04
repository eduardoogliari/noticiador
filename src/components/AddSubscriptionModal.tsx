import { useEffect, useRef, useState } from "react";
import { NewSubscription } from "../types/subscription";
const isUrlHttp = require('is-url-http');
const sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;
import styles from './AddSubscriptionModal.module.css';
import { useTranslation } from "react-i18next";

// const defaultMessageInfo = 'Waiting for input...';
// const validatingMessageInfo = 'Validating URL...';
// const errorMessageInfo = "Invalid URL. Please provide a valid url in the format: 'https://example.com'";

export default function AddSubscriptionModal() {
    const { t } = useTranslation();
    const [messageInfo, setMessageInfo]     = useState(t('modal_add_subscriptions_message_waiting'));
    const [inputURL, setInputURL]                     = useState('');
    const inputRef                          = useRef<HTMLInputElement>(null);
    const [inputDisabled, setInputDisabled] = useState(false);

    // Input focus by default
    useEffect( () => {
        setMessageInfo(t('modal_add_subscriptions_message_waiting'));
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
        setMessageInfo( t('modal_add_subscriptions_message_validating_url') );

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
                setMessageInfo( t('modal_add_subscriptions_message_no_feeds') );
            }
        } else {
            setMessageInfo( t('modal_add_subscriptions_message_invalid_url') );
        }
        setInputDisabled(false);
    }

    return (
        <>
            <div className={styles["add-subscription-modal-container"]}>

                <div className={styles["add-subscription-modal"]}>

                    <div className={styles["add-subscription-input"]}>
                        <input
                            ref={inputRef}
                            placeholder={t('modal_add_subscriptions_url_placeholder')}
                            onChange={onInputChanged}
                            value={inputURL}
                            onKeyUp={onKeyUp}
                            disabled={inputDisabled}
                        ></input>

                        <button onClick={onClick} disabled={inputDisabled}>{t('modal_add_subscriptions_button_add')}</button>
                    </div>

                    <div className={styles["add-subscription-info"]}>
                        <span>{messageInfo}</span>
                    </div>
                </div>
            </div>
        </>
    );
}