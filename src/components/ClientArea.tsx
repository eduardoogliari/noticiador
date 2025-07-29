import { useEffect, useRef, useState } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { FeedItem } from '../types/feed-item';
import FeedList from './FeedList';
import { NewSubscription, Subscription } from '../types/subscription';
import  { isValidURL } from '../utils';
import ExpandableGroup from './ExpandableGroup';
import SubscriptionsList from './SubscriptionsList';
import Toolbar from './Toolbar';
import StatusBar from './StatusBar';

export default function ClientArea() {
    const [showLeftPanel, setShowLeftPanel]                   = useState(true);
    const [feedItems, setFeedItems]                           = useState<FeedItem[]>([]);
    const [faviconCache, setFaviconCache]                     = useState<Record<number, string>>({});
    const [selectedItemId, setSelectedItemId]                 = useState(-1);
    const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(-1);
    const [subscriptions, setSubscriptions]                   = useState<Subscription[]>([]);
    const webviewRef                                          = useRef<Electron.WebviewTag>(null);

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
                // 'https://alain.xyz',
                'https://brevzin.github.io/',
                // 'https://kevingal.com',
                // 'https://www.vincentparizet.com/blog/',
                // 'https://www.modernescpp.com',
            ];

            for( const url of linkArr ) {
                if( isValidURL( url ) ) {
                    const feedUrl = await window.rssAPI.findFeedURL( url );

                    if( feedUrl ) {
                        console.log(feedUrl);
                        const title = await window.rssAPI.getFeedTitle( feedUrl );
                        const faviconBlob = await window.rssAPI.getFeedFavicon( feedUrl );

                        const s : NewSubscription = { name: title, url: feedUrl,  last_updated: new Date().toISOString(), favicon: faviconBlob  };
                        console.log( s );
                        await window.rssAPI.addSubscriptions(
                            [
                                s
                            ]
                        )
                    } else {
                        console.warn(`No feed found for ${url}`);
                    }
                } else {
                    console.warn(`No feed found for ${url}`);
                }
            }
            setFinishedCreatingSubs(true);

            (async() => {
                const subs : Subscription[] = await window.rssAPI.getSubscriptions();
                setSubscriptions(subs);
            })();

            (async () => {
                const favicons = await regenerateFavicons();
                setFaviconCache(favicons);
            })();

            (async () => {
                await updateAllFeeds();
            })();

        })();
    }, []);

    function onFeedItemClick( itemId : number ) {
        if( itemId != selectedItemId ) {
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
    }

    async function onSubscriptionItemClick( subId : number ) {
        if( subId != selectedSubscriptionId ) {
            const foundItem = subscriptions.find( (item) => item.id == subId );
            if( foundItem ){
                console.log( "Clicked on SUB" + foundItem.url );

                const items = await window.rssAPI.getFeeds([foundItem]);

                setSelectedSubscriptionId(subId);
                setFeedItems(items);
            }
        }
    }

    async function onAllFeedsItemClick() {
        if( selectedSubscriptionId != -1 ) {
            const items = await window.rssAPI.getFeeds(subscriptions);

            setSelectedSubscriptionId(-1);
            setFeedItems(items);
        }
    }

    function getFeedName( subId : number ) {
        let name = <span>🌐 Showing all feeds</span>;

        const foundItem = subscriptions.find( (item) => item.id == subId );
        if( foundItem ){
            return <><img src={faviconCache[subId]}></img><span>{foundItem.name}</span></>
        }
        return name;
    }

    function onToggleSidePanelClick() {
        setShowLeftPanel(!showLeftPanel);
    }

    return (
        <div className={'client-area'}>
            <Toolbar></Toolbar>
            <PanelGroup autoSaveId="conditional" direction="horizontal">
                {
                    showLeftPanel && (
                        <>
                            <Panel id="left" className={'panel-left'} order={1} minSize={20}>
                                <ul className={`all-feeds ${selectedSubscriptionId == -1 ? 'selected' : ''}`}>
                                    <li title={"Show all feeds"} onClick={onAllFeedsItemClick}>🌐 Show all feeds</li>
                                </ul>

                                <ExpandableGroup title='Favorites'>
                                    <p>Favorite1</p>
                                    <p>Favorite2</p>
                                </ExpandableGroup>

                                <ExpandableGroup title='Categories'>
                                    <p>Technology</p>
                                    <p>Movies</p>
                                    <p>Music</p>
                                </ExpandableGroup>

                                <ExpandableGroup title='Subscriptions'>
                                    <SubscriptionsList faviconCache={faviconCache} onClick={onSubscriptionItemClick} subscriptions={subscriptions} selectedSubscriptionId={selectedSubscriptionId}></SubscriptionsList>
                                </ExpandableGroup>
                            </Panel>
                            <PanelResizeHandle className='panel-resizer-handle'/>
                        </>
                    )
                }
                <Panel id="center" className={'panel-middle'} order={2} minSize={30}>
                    <div className='feed-header'>{ getFeedName(selectedSubscriptionId) }</div>
                    <FeedList feedItems={feedItems} onClick={onFeedItemClick} faviconCache={faviconCache} selectedItemId={selectedItemId} ></FeedList>
                </Panel>
                {
                    <>
                        <PanelResizeHandle className='panel-resizer-handle' />
                        <Panel id="right" className={'panel-right'} order={3} minSize={30}>
                            <webview ref={webviewRef} className={'web-preview'} id='page-preview'  partition="persist:custom-partition"></webview>
                        </Panel>
                    </>
                }
            </PanelGroup>
            <StatusBar onToggleSidePanelClick={onToggleSidePanelClick} isHidden={!showLeftPanel}></StatusBar>
        </div>
    );
}