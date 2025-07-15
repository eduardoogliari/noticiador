import { useEffect, useRef, useState } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { FeedItem } from '../types/FeedItem';
import FeedList from './FeedList';
import { Subscription } from '../types/Subscription';

export default function ClientArea() {
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [showRightPanel, setShowRightPanel] = useState(true);
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const webviewRef = useRef<Electron.WebviewTag>(null);

    async function updateAllFeeds() {
        try {
            const subs : Subscription[] = await window.rssAPI.getSubscriptions();

            const feed = await window.rssAPI.getFeed(subs);
            console.log(feed);
            setFeedItems(feed);
        } catch (err) {
            console.error('Failed to load RSS feed after retries:', err);
        }
    }

    useEffect(() => {
        updateAllFeeds();
    }, []);

    function onFeedItemClick( url : string ) {
        console.log( "Clicked on " + url );

        const webview = document.getElementById('page-preview') as Electron.WebviewTag;
        if (webviewRef.current) {
            webviewRef.current.src = url;
        }
    }

    return (<>
        <PanelGroup  autoSaveId="conditional" direction="horizontal">
            {
                showLeftPanel && (
                    <>
                        <Panel id="left" className={'panel-left'} order={1} minSize={10}>
                            left
                        </Panel>
                        <PanelResizeHandle className='panel-resizer-handle'/>
                    </>
                )
            }
            <Panel id="center" className={'panel-middle'} order={2} minSize={10}>
                <FeedList feedItems={feedItems} onClick={onFeedItemClick} ></FeedList>

            </Panel>
            {
                showRightPanel && (
                    <>
                    <PanelResizeHandle className='panel-resizer-handle' />
                        <Panel id="right" className={'panel-right'} order={3} minSize={10}>
                            <webview ref={webviewRef} className={'web-preview'} id='page-preview'></webview>
                        </Panel>
                    </>
                )
            }
        </PanelGroup>

    </> );
}