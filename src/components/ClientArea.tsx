import { useEffect, useRef, useState } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { FeedItem } from '../types/FeedItem';
import FeedList from './FeedList';
import { NewSubscription, Subscription } from '../types/Subscription';
import  { isValidURL } from '../utils';

export default function ClientArea() {
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [showRightPanel, setShowRightPanel] = useState(true);
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const webviewRef = useRef<Electron.WebviewTag>(null);

    async function updateAllFeeds() {
        try {
            const subs : Subscription[] = await window.rssAPI.getSubscriptions();

            const results = await window.rssAPI.refreshFeeds(subs);
            console.log(results);
            const items = await window.rssAPI.getFeeds(subs);
            console.log(items);
            setFeedItems(items);
        } catch (err) {
            console.error('Failed to load RSS feed after retries:', err);
        }
    }

    useEffect(() => {
        ( async () => {
            const linkArr = [
                'https://news.ycombinator.com/rss',
                'https://alain.xyz',
                'https://brevzin.github.io/',
                'https://kevingal.com',
                'https://www.vincentparizet.com/blog/',
                'https://www.modernescpp.com',
            ];

            for( const url of linkArr ) {
                if( isValidURL( url ) ) {
                    const feedUrl = await window.rssAPI.findFeedURL( url );
                    console.log(feedUrl);

                    if( feedUrl ) {
                        const title = await window.rssAPI.getFeedTitle( feedUrl );
                        const faviconBlob = await window.rssAPI.getFeedFavicon( feedUrl );

                        const s : NewSubscription = { name: title, url: feedUrl,  last_updated: new Date().toISOString(), favicon: faviconBlob  };
                        console.log( s );
                        await window.rssAPI.addSubscriptions(
                            [
                                s
                            ]
                        )
                    }
                } else {
                    console.warn(`No feed found for ${url}`);
                }
            }
            setFinishedCreatingSubs(true);
        })();
    }, []);
    useEffect(() => {
        (async () => {
            await updateAllFeeds();
        })();
    }, [finishedCreatingSubs]);

    function onFeedItemClick( url : string ) {
        console.log( "Clicked on " + url );

        const webview = document.getElementById('page-preview') as Electron.WebviewTag;
        if (webviewRef.current && webviewRef.current?.src !== url ) {
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