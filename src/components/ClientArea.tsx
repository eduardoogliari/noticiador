import { useEffect, useRef, useState } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { FeedItem } from '../types/feed-item';
import FeedList from './FeedList';
import { NewSubscription, Subscription } from '../types/subscription';
import  { isValidURL } from '../utils';

export default function ClientArea() {
    const [showLeftPanel, setShowLeftPanel] = useState(true);
    const [showRightPanel, setShowRightPanel] = useState(true);
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [faviconCache, setFaviconCache] = useState<Record<number, string>>({});
    const [selectedItemId, setSelectedItemId] = useState(-1);
    const webviewRef = useRef<Electron.WebviewTag>(null);

    const [finishedCreatingSubs, setFinishedCreatingSubs] = useState(false);

    async function regenerateFavicons() {
        let favicons : Record<number, string> = {};
        const subs = await window.rssAPI.getSubscriptions();
        for( const s of subs ) {
            try {
                const buffer = await window.rssAPI.getFaviconData(s.id);
                if( buffer ) {
                    const uint8       = new Uint8Array(buffer);
                    const blob        = new Blob([uint8.buffer], {type: 'image/png'});
                    const faviconData = URL.createObjectURL(blob);

                    favicons[s.id] = faviconData;

                    console.log( `Created favicon for sub id ${s.id}` );
                }
            } catch(err) {
                console.error( `Failed at regenerateFavicons() for sub id ${s.id}`, err );
            }
        }
        return favicons;
    }

    async function updateAllFeeds() {
        try {
            const subs : Subscription[] = await window.rssAPI.getSubscriptions();
            const results = await window.rssAPI.refreshFeeds(subs);
            const items = await window.rssAPI.getFeeds(subs);
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
            const favicons = await regenerateFavicons();
            setFaviconCache(favicons);
        })();
    }, [finishedCreatingSubs]);

    useEffect(() => {
        (async () => {
            await updateAllFeeds();
        })();
    }, [finishedCreatingSubs]);

    function onFeedItemClick( itemId : number ) {
        const foundItem = feedItems.find( (item) => item.id == itemId );
        if( foundItem ){            
            console.log( "Clicked on " + foundItem.url );

            setSelectedItemId(itemId);

        const webview = document.getElementById('page-preview') as Electron.WebviewTag;
            if (webviewRef.current && webviewRef.current?.src !== foundItem.url ) {
                webviewRef.current.src = foundItem.url;
            }
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
                <FeedList feedItems={feedItems} onClick={onFeedItemClick} faviconCache={faviconCache} ></FeedList>

            </Panel>
            {
                showRightPanel && (
                    <>
                    <PanelResizeHandle className='panel-resizer-handle' />
                        <Panel id="right" className={'panel-right'} order={3} minSize={10}>
                            <webview ref={webviewRef} className={'web-preview'} id='page-preview'  partition="persist:custom-partition"></webview>
                        </Panel>
                    </>
                )
            }
        </PanelGroup>

    </> );
}